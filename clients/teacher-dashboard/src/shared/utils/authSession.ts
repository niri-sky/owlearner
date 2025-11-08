import { authOptions } from "@/shared/utils/authOptions";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export const homeRedirect = async ()=>{
    const session = await getServerSession(authOptions);
    if (!session || !session.user)
      redirect(
        "/signin?callback=" +
          encodeURIComponent(process.env.NEXTAUTH_URL + "/dashboard")
      );
  
    redirect("/dashboard");
}

export const authRedirect = async ()=>{
    const session = await getServerSession(authOptions);
    if (session && session.user){
        redirect("/dashboard");
    }
}