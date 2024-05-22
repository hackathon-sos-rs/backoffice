import { useEffect, useState } from "react";

const useLocalStorageState = (key: string, defaultValue: any) => {
   const [state, setState] = useState(() => {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
         return JSON.parse(valueInLocalStorage);
      }
      return defaultValue;
   });
   
   useEffect(() => {
      if (state == null || state == undefined) {
         window.localStorage.removeItem(key);
      } else {
         window.localStorage.setItem(key, JSON.stringify(state));
      }
   }, [state]);
   
   return [state, setState];
}

export default useLocalStorageState;