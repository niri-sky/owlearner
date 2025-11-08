import StudentDataProvider from "@/shared/context/StudentDataProvider";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <StudentDataProvider>{children}</StudentDataProvider>;
}

export default Layout;
