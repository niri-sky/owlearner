import { useSession } from "next-auth/react";
import React from "react";

type ReturnData = {
  isEditor: boolean;
  userData?: UserData;
};

function useUserData(): ReturnData {
  const { data } = useSession();
  let teacher: any = data?.user as any;

  const isEditor = true;

  return { userData: teacher || {}, isEditor };
}

export default useUserData;
