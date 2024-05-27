'use client';
import ShellPage from "@/components/ShellPage";
import getItems from "@/services/directus-cms/getItems";
import { Button, Card, Table, TextInput } from "flowbite-react";
import { HiOutlineXCircle } from "react-icons/hi";
import { useEffect, useState } from "react";

const PharmStockPage = () => {

   const [stock, setStock] = useState<any>([]);

   const [search, setSearch] = useState<string>('');

   useEffect(() => {
      (async () => {
         const items = await getItems({
            collection: 'pharma_stock', fields: ['*.*', 'sku.therapeutic_class.*', 'sku.form.*'],
         });
         setStock(items);
      })();
   }, [])

   const cleanup = () => {
      setSearch('');
      (async () => {
         const items = await getItems({
            collection: 'pharma_stock',
            fields: ['*.*', 'sku.therapeutic_class.*', 'sku.form.*'],
         });
         setStock(items);
      })();
   }

   const invokeSearch = () => {
      (async () => {
         let filter = null;
         if (search && search.length) {
            filter = {
               _or: [
                  {
                     sku: {
                        active_principle: {
                           _icontains: search
                        }
                     }
                  },
                  {
                     sku: {
                        sku: {
                           _contains: search
                        }
                     }
                  },
                  {
                     sku: {
                        therapeutic_class: {
                           name: {
                              _contains: search
                           }
                        }
                     }
                  },
               ]
            }
         }
         const items = await getItems({
            collection: 'pharma_stock',
            fields: ['*.*', 'sku.therapeutic_class.*', 'sku.form.*'],
            filterRules: filter
         });
         setStock(items);
      })();
   }


   return <>
      <ShellPage title={'Estoque Médico'}>
         <div className="flex mb-4 gap-4">
            <TextInput onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && invokeSearch()} type="text" className="flex-1" placeholder="Buscar por codigo de barra ou principio ativo" />
            <Button onClick={() => invokeSearch()} size={'sm'} className="px-3 py-1 bg-blue-500 text-white">Buscar</Button>
            <Button onClick={() => cleanup()} size={'sm'} color={'warning'} className="px-3 py-1">Limpar</Button>
         </div>
         <Table className="pharma-stock">
            <Table.Head>
               <Table.HeadCell>Código de Barras</Table.HeadCell>
               <Table.HeadCell>Medicamento</Table.HeadCell>
               <Table.HeadCell>Concentração</Table.HeadCell>
               <Table.HeadCell>Forma</Table.HeadCell>
               <Table.HeadCell>Classe</Table.HeadCell>
               <Table.HeadCell>Quantidade</Table.HeadCell>
            </Table.Head>
            <Table.Body>
               {stock.map((item: any) =>
                  <Table.Row>
                     <Table.Cell>{item.sku.sku}</Table.Cell>
                     <Table.Cell>{item.sku.active_principle}</Table.Cell>
                     <Table.Cell>{item.sku.concentration}{item.sku.concentration_unit}</Table.Cell>
                     <Table.Cell>{item.sku.form?.form || '-'}</Table.Cell>
                     <Table.Cell>{item.sku.therapeutic_class?.name || '-'}</Table.Cell>
                     <Table.Cell>{((item.batchs.length && item.batchs) || []).map((batch: any) => batch.amount).reduce((acc: number, next: number) => acc + next, 0)}</Table.Cell>
                  </Table.Row>
               )}
            </Table.Body>
         </Table>
      </ShellPage>
   </>
}

export default PharmStockPage;