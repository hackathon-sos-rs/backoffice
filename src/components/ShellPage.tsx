
const ShellPage = ({ title, children }: any) => {
   return <>
      <div className="m-5">
         <h1 className="text-2xl font-bold tracking-tight dark:text-white uppercase text-gray-700 mb-5">
            { title }
         </h1>
         { children }
      </div>
   </>
}

export default ShellPage;