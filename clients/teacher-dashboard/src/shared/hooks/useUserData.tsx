import { useSession } from "next-auth/react";
import React from "react";

type ReturnData = {
  userData?: UserData;
};

function useUserData(): ReturnData {
  const { data } = useSession();
  let teacher: any = data?.user as any;

  return { userData: teacher || {} };
}

export default useUserData;
