import useLocalStorageState from "@/hooks/useLocalStorageState";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const User = () => {
   const [user, setUser] = useLocalStorageState('user', null);
   const router = useRouter();
   useEffect(() => {
      if (!user) {
         setUser(null);
         router.replace('/login');
      }
   }, [user]);

   return (<>
      {  user && user.userData &&
         <div className="border p-4 mb-5 flex flex-row gap-5">
            <span>{user.userData.first_name} {user.userData.last_name}</span>

            {user.userData.identifiers && user.userData.identifiers.map((identifier: any) =>
               <>
                  <span>
                     <span className="font-bold mr-1">{identifier.type}:</span>
                     <span>{identifier.value}</span>
                  </span>
               </>
            )}

            <button className="underline self-end" onClick={() => confirm('Voce tem certeza?') && setUser(null)}> Sair </button>
         </div>
      }
   </>)
}

export default User;