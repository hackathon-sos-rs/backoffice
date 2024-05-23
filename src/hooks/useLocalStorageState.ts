import { useEffect, useState } from "react";

const useLocalStorageState = (key: string, defaultValue: any) => {
   const [state, setState] = useState(() => {
      const valueInLocalStorage = localStorage.getItem(key);
      if (valueInLocalStorage) {
         return JSON.parse(valueInLocalStorage);
      }
      return defaultValue;
   });
   
   useEffect(() => {
      if (state == null || state == undefined) {
         localStorage.removeItem(key);
      } else {
         localStorage.setItem(key, JSON.stringify(state));
      }
   }, [state]);
   
   return [state, setState];
}

export default useLocalStorageState;