import { createItem } from '@directus/sdk';
import directus from './directus';

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
      activePrinciple: string;
      form: number;
      volume: number;
      therapeuticClass: number;
      concentration: number;
      concentrationUnit: string;
   }
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

   debugger;

   let itemId = null;

   if (stock.medicine) {
      const output = await directus.request(
         createItem('medication', {
            sku: stock.sku,
            form: stock.medicine.form,
            volume: stock.medicine.volume,
            therapeutic_class: stock.medicine.therapeuticClass,
            active_principle: stock.medicine.activePrinciple,
            concentration: stock.medicine.concentration,
            concentration_unit: stock.medicine.concentrationUnit,
         })
      );
      itemId = output.id;
   } else {
      itemId = stock.itemId
   }

   debugger;

   return directus.request(
      createItem('pharma_stock_events', {
         sku: itemId,
         batch: stock.batch,
         amount: stock.quantity,
         valid_until: stock.validUntil,
         manufacturer: stock.manufacturer,
         location: stock.location,
         inout: 'in'
      })
   );
}