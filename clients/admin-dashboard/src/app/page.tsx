import { homeRedirect } from "@/shared/utils/authSession";

export default async function Home() {
  await homeRedirect();
  return <></>;
}
