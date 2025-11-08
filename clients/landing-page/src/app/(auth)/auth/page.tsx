import Auth from "@/modules/auth";
import { authRedirect } from "@/shared/utils";

const Page = async () => {
  await authRedirect();
  return (
    <>
      <Auth />
    </>
  );
};

export default Page;
