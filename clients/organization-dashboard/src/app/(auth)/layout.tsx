import { authRedirect } from "@/shared/utils/authSession";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

async function AuthLayout({ children }: Props) {
  await authRedirect();

  return <>{children}</>;
}

export default AuthLayout;
