import { useSession } from "next-auth/react";

type ReturnData = {
  userData?: UserData;
};

function useUserData(): ReturnData {
  const { data } = useSession();
  let user: any = data?.user as any;

  return { userData: user };
}

export default useUserData;
