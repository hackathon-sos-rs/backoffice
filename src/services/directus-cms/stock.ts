import { createItem, updateItem } from '@directus/sdk';
import directus from './directus';
import getItems from './getItems';

/**
 * Represents the category of a stock item.
 */
export enum StockInputType {
   MEDICINE = 1,
   GENERAL = 2
}

/**
 * Represents the input for creating or updating a stock item.
 */
export type StockInput = {
   sku: string;
   location: number;
   validUntil: number;
   quantity: number;
   inputType: StockInputType;
   itemId?: number;
   batch?: string;
   manufacturer?: number;
   general?: {
      name: string;
      category: number;
      unit: string;
   },
   medicine?: {
      isFresh: boolean;
      activePrinciple: string;
      form: number;
      volume: number;
      therapeuticClass: number;
      concentration: number;
      concentrationUnit: string;
   }
}

export type PharmStockModifier = {
   medicationId: number;
   location: number;
   batchBreakdown: {
      batch: string,
      amount: number
   }[],
   operation: 'in' | 'out'
}

/**
 * Saves the stock based on its category.
 * 
 * @param stock - The stock to be saved.
 * @returns A promise that resolves with the saved stock.
 * @throws An error if the stock category is invalid.
 */
export async function saveStock(stock: StockInput) {
   if (stock.inputType === StockInputType.GENERAL) {
      return saveGeneralStock(stock);
   } else if (stock.inputType === StockInputType.MEDICINE) {
      return saveMedicineStock(stock);
   }
   throw new Error('Invalid stock category');
}

/**
 * Saves the general stock information.
 * @param stock - The stock input data.
 * @returns A promise that resolves to the result of saving the stock item.
 */
export async function saveGeneralStock(stock: StockInput) {

   let itemId = null;

   if (stock.general) {
      const output = await directus.request(
         createItem('item', {
            ref_id: stock.sku,
            name: stock.general.name,
            unit_of_measurement: stock.general.unit,
            category_id: stock.general.category,
         })
      );
      itemId = output.id;
   } else {
      itemId = stock.itemId
   }

   return directus.request(
      createItem('stock_item', {
         item: itemId,
         location: stock.location,
         valid_until: stock.validUntil,
         quantity: stock.quantity,
      })
   );
}

/**
 * Saves the medicine stock.
 * @param stock - The stock input data.
 * @returns A promise that resolves to the saved stock data.
 * @throws An error if the medicine stock does not have a batch.
 */
export async function saveMedicineStock(stock: StockInput) {

   if (!stock.batch) {
      throw new Error('Medicine stock must have a batch');
   }

   let itemId = null;
   let freshStock = false;

   if (stock.medicine) {
      if (stock.medicine.isFresh) {
         const output = await directus.request(
            createItem('medication', {
               sku: stock.sku,
               form: stock.medicine.form,
               volume: stock.medicine.volume,
               therapeutic_class: stock.medicine.therapeuticClass,
               active_principle: stock.medicine.activePrinciple,
               manufacturer: stock.manufacturer,
               concentration: stock.medicine.concentration,
               concentration_unit: stock.medicine.concentrationUnit,
            })
         );
         itemId = output.id;
      } else if(stock.itemId) {
         const output = await directus.request(
            updateItem('medication', stock.itemId, {
               form: stock.medicine.form,
               therapeutic_class: stock.medicine.therapeuticClass,
            })
         );
         itemId = output.id;
      }
   } else {
      itemId = stock.itemId
   }

   freshStock = await getItems({
      collection: 'pharma_stock',
      fields: ["*", "*.*"],
      filterRules: { sku: { _eq: itemId } }
   }).then((pharmaStock) => pharmaStock.length === 0);

   if (freshStock) {
      await directus.request(createItem('pharma_stock', {
         sku: itemId,
         batchs: [{
            batch: stock.batch,
            amount: stock.quantity,
            validUntil: stock.validUntil
         }],
         amount: stock.quantity,
         valid_until: stock.validUntil,
         manufacturer: stock.manufacturer,
         location: stock.location,
         inout: 'in'
      }))
   }

   const resultBag = await bumpPharmStock({
      medicationId: itemId,
      location: stock.location,
      batchBreakdown: [{
         batch: stock.batch,
         amount: stock.quantity
      }],
      operation: 'in',
   });

   return resultBag;
}

export async function bumpPharmStock(stock: PharmStockModifier) {

   let result = null;
   const resultBag = [];

   const eventPromises = stock.batchBreakdown.filter(batch => batch.amount > 0).map((batch) => {
      return directus.request(
         createItem('pharma_stock_events', {
            sku: stock.medicationId,
            batch: batch.batch,
            amount: batch.amount,
            location: stock.location,
            inout: 'out'
         })
      );
   });

   result = await Promise.all(eventPromises);
   resultBag.push(result);
   debugger;
   let remoteStock = await findStock(stock.medicationId);
   if (remoteStock) {
      for (let i = 0; i < stock.batchBreakdown.length; i++) {
         let batch = stock.batchBreakdown[i];
         remoteStock.batchs = updateOrCreate(remoteStock.batchs, {
            batch: batch.batch,
            amount: batch.amount,
            validUntil: remoteStock.valid_until,
            location: stock.location
         }, (element, newElement) => {
            if (stock.operation === 'out') {
               element.amount = element.amount - newElement.amount;
            } else {
               element.amount = element.amount + newElement.amount;
            }
            return element;
         });
      }
      result = await directus.request(updateItem('pharma_stock', remoteStock.id, {
         ...remoteStock,
      }));
      resultBag.push(result);
   }
   return resultBag;
}

export async function findStock(itemId: number) {
   try {
      const items = await getItems({
         collection: 'pharma_stock',
         fields: ["*", "*.*"],
         filterRules: {
            sku: { _eq: itemId }
         }
      })
      return items.length && items[0];
   } catch (err) {
      return null;
   }
}

function updateOrCreate(elements: any[], newElement: any, callback: (element: any, newElement: any) => any) {
   let updated = false;
   for (let i = 0; i < elements.length; i++) {
      if (elements[i].batch === newElement.batch) {
         elements[i] = callback(elements[i], newElement);
         updated = true;
         break;
      }
   }
   if (!updated) {
      elements.push(newElement);
   }
   return elements;
}
