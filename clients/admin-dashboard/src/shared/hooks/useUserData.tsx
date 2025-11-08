import { useSession } from "next-auth/react";
import React from "react";

type ReturnData = {
  userData?: UserData;
  isAdmin: boolean;
  isModerator: boolean;
};

function useUserData(): ReturnData {
  const { data } = useSession();
  let admin: any = data?.user as any;

  let isAdmin = admin?.role === "admin";
  let isModerator = admin?.role === "moderator";

  return { userData: admin || {}, isAdmin, isModerator };
}

export default useUserData;
