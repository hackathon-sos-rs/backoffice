import { useEffect, useState } from "react";

const useLocalStorageState = <T>(key: string, defaultValue: T) => {
   const [state, setState] = useState<T>(() => {
      const valueInLocalStorage = localStorage.getItem(key);
      if (valueInLocalStorage) {
         return JSON.parse(valueInLocalStorage) as T;
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
   
   return [state, setState] as const;
}

export default useLocalStorageState;