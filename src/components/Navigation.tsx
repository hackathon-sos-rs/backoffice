'use client';

import useLocalStorageState, { useLocalStorageEffect } from "@/hooks/useLocalStorageState";
import { FlowbiteSidebarTheme, Sidebar } from "flowbite-react";
import { useState } from "react";
import { HiArchive, HiClipboardList, HiUpload, HiDownload } from "react-icons/hi";

type NavigationSettings = {
   pharmStockCollapsed: boolean;
   generalStockCollapsed: boolean;
}

const Navigation = () => {

   const [refresh, setRefresh] = useState(0);

   const [user, setUser] = useLocalStorageState<any>('user', null);
   const [location, setLocation] = useLocalStorageState<any>('location', null);

   const [navigationSettings, setNavigationSettings] = useLocalStorageState<NavigationSettings>('navigationSettings', {
      pharmStockCollapsed: false,
      generalStockCollapsed: false,
   });

   const toggle = (key: keyof NavigationSettings) => {
      setNavigationSettings({ ...navigationSettings, [key]: !navigationSettings[key] });
   }

   return user && location && (
      <div className="h-screen border-r">
         <Sidebar aria-label="Sidebar with multi-level dropdown example">
            <Sidebar.Items>
               <Sidebar.ItemGroup>
                  <Sidebar.Collapse icon={HiArchive} open={navigationSettings.pharmStockCollapsed} onClick={() => toggle('pharmStockCollapsed')} label="Estoque Médico">
                     <Sidebar.Item href="/dashboard/pharma-stock" icon={HiClipboardList}>Consulta</Sidebar.Item>
                     <Sidebar.Item href="/dashboard/pharma-stock/input" icon={HiDownload}>Entrada</Sidebar.Item>
                     <Sidebar.Item href="/dashboard/pharma-stock/out" icon={HiUpload}>Saída</Sidebar.Item>
                  </Sidebar.Collapse>
                  <Sidebar.Collapse icon={HiArchive} open={navigationSettings.generalStockCollapsed} onClick={() => toggle('generalStockCollapsed')} label="Estoque Geral">
                     <Sidebar.Item href="#" icon={HiClipboardList}>Consulta</Sidebar.Item>
                     <Sidebar.Item href="#" icon={HiDownload}>Entrada</Sidebar.Item>
                     <Sidebar.Item href="#" icon={HiUpload}>Saída</Sidebar.Item>
                  </Sidebar.Collapse>
               </Sidebar.ItemGroup>
               <Sidebar.ItemGroup>
                  <Sidebar.Item href="#">Sair</Sidebar.Item>
               </Sidebar.ItemGroup>
            </Sidebar.Items>
         </Sidebar>
      </div>
   );
}

export default Navigation;