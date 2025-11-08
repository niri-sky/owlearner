"use client";

import React from "react";
import AdminSidebar from "../admin-sidebar";
import HeaderSection from "./header";
import { useAtom } from "jotai";
import { SidebarCollapseState } from "@/shared/utils/state";
import { cn } from "@/shared/utils";
import NotificationButton from "./NotificationButton";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useAtom(SidebarCollapseState);
  return (
    <div>
      <AdminSidebar />
      <HeaderSection />
      <div
        className={cn(
          " w-full",
          isCollapsed ? "md:pl-[80px]" : "md:pl-[270px]"
        )}
      >
        <div className="p-2 md:p-5 lg:p-[30px]">
          <div className=" mb-5 hidden md:flex justify-end">
            <NotificationButton />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
