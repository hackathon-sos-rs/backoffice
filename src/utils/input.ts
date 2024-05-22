export function debounce(callback: Function, wait: number) {
   let timeoutId: any = null;
   return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
         callback(...args);
      }, wait);
   };
}

export function handleKeyPress(inputs: HTMLInputElement[]) {
   return (event: KeyboardEvent) => {
      const { key } = event;
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter") {
         event.preventDefault();
         const currentIndex = inputs.findIndex(input => input === document.activeElement);
         let nextIndex = 0;
         if (key === "ArrowDown") {
            nextIndex = currentIndex + 1;
            if (nextIndex >= inputs.length) {
               nextIndex = 0;
            }
         } else if (key === "ArrowUp") {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
               nextIndex = inputs.length - 1;
            }
         } else if (key === "Enter") {
            nextIndex = currentIndex + 1;
            if (nextIndex >= inputs.length) {
               nextIndex = 0;
            }
         }
         inputs[nextIndex].focus();
      }
   };
}