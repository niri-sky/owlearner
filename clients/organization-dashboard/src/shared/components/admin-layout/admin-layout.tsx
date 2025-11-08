"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "../admin-sidebar";
import HeaderSection from "./header";
import { useAtom } from "jotai";
import { MobileSidebarState, SidebarCollapseState } from "@/shared/utils/state";
import { cn } from "@/shared/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LeftArrow from "@/shared/icons/LeftArrow";
import NotificationButton from "./NotificationButton";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // states
  const [pathMatch, setPathMatch] = useState(false);
  const [isCollapsed, setIsCollapsed] = useAtom(SidebarCollapseState);
  const [isMobileSidebar, setMobileSidebar] = useAtom(MobileSidebarState);
  //
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/profile") {
      setPathMatch(true);
      setIsCollapsed(false);
    } else {
      setPathMatch(false);
      setIsCollapsed(false);
    }
    setMobileSidebar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <div>
      <div className={cn(pathMatch && "md:hidden")}>
        <AdminSidebar />
      </div>
      <HeaderSection pathMatch={pathMatch} />
      <div
        className={cn(
          " w-full",
          pathMatch ? "w-full" : isCollapsed ? "md:pl-[80px]" : "md:pl-[270px]"
        )}
      >
        <div className="p-2 md:p-5 lg:p-[30px]">
          <div
            className={`mb-5 hidden md:flex ${
              pathMatch ? "justify-between" : "justify-end"
            } `}
          >
            {pathMatch ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                <LeftArrow />
                Go back
              </Link>
            ) : (
              <></>
            )}
            <NotificationButton />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
