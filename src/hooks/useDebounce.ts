import { useEffect, useState } from "react";

const useDebounce = (value: any, delay: number): [any, (value: any) => void] => {
   const [debouncedValue, setDebouncedValue] = useState(value);
   const [futureValue, setFutureValue] = useState(null);
   
   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);
      
      return () => {
         clearTimeout(handler);
      };
   }, [value, delay, futureValue]);
   
   return [debouncedValue, setFutureValue];
}

export default useDebounce;
