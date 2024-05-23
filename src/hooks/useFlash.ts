import { useEffect, useState } from "react";

const useFlash = (value: any, timeout = 2000) => {
   const [flash, setFlash] = useState(value);
   useEffect(() => {
      if (flash) {
         const timer = setTimeout(() => {
            setFlash(() => null);
         }, timeout);
         return () => clearTimeout(timer);
      }
   }, [flash]);
   
   return [flash, setFlash];
}

export default useFlash