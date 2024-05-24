'use client';

import User from "@/components/User";
import getItems from "@/services/directus-cms/getItems";
import Link from "next/link";
import { useEffect, useState } from "react";

const PharmaStockPage = () => {

   const [stock, setStock] = useState<any>([]);

   const [search, setSearch] = useState<string>('');


   useEffect(() => {
      (async () => {
         const items = await getItems({
            collection: 'pharma_stock', fields: ['*.*','sku.therapeutic_class.*', 'sku.form.*'],
         });
         setStock(items);
      })();
   }, [])

   const cleanup = () => {
      setSearch('');
      (async () => {
         const items = await getItems({
            collection: 'pharma_stock',
            fields: ['*.*','sku.therapeutic_class.*', 'sku.form.*'],
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
            fields: ['*.*','sku.therapeutic_class.*', 'sku.form.*'],
            filterRules: filter
         });
         setStock(items);
      })();
   }


   return <>
      <User />
      <div className="w-3/4 m-auto">

         <div className="flex mb-4">
            <h1 className="flex-1">Estoque de farmacia</h1>
            <div className="flex-1 flex justify-end gap-5">
               <Link href={'/pharma-stock/input'} className="px-3 py-1 bg-green-500 text-white">Entrada de estoque</Link>
               <Link href={'/pharma-stock/input'} className="px-3 py-1 bg-violet-500 text-white">Saida de estoque</Link>
            </div>
         </div>

         <div className="flex mb-4 gap-4">
            <input onChange={(e) => setSearch(e.target.value)} type="text" className="flex-1" placeholder="Buscar por codigo de barra ou principio ativo" />
            <button onClick={(e) => invokeSearch()} className="px-3 py-1 bg-blue-500 text-white">Buscar</button>
            <button onClick={(e) => cleanup()} className="px-3 py-1  underline">Limpar</button>
         </div>

         <table className="pharma-stock">
            <thead>
               <tr>
                  <th>Medicamento</th>
                  <th>Concentration</th>
                  <th>Forma</th>
                  <th>Classe</th>
                  <th>Quantidade</th>
               </tr>
            </thead>
            <tbody>
               {stock.map((item: any) => (
                  <tr key={item.id}>
                     <td>{item.sku.active_principle}</td>
                     <td>{item.sku.concentration}{item.sku.concentration_unit}</td>
                     <td>{item.sku.form.form}</td>
                     <td>{item.sku.therapeutic_class.name}</td>
                     <td>{item.amount}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </>
}

export default PharmaStockPage;