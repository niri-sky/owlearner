"use client";
// global pakage imports
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { ProSidebar, Menu } from "react-pro-sidebar";

// custom file imports
import "react-pro-sidebar/dist/css/styles.css";
import SidebarTop from "./elements/sidebar-top";
import SidebarMenus from "./elements/sidebar-menus";

import { useAtom } from "jotai";
import { MobileSidebarState, SidebarCollapseState } from "@/shared/utils/state";
import { cn } from "@/shared/utils";
import { signOut } from "next-auth/react";

/* -------------------------------------------------------------------------- */
/*                          admin sidebar components                          */
/* -------------------------------------------------------------------------- */
const AdminSidebar = () => {
  const [logout, setlogout] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("Dashboard");
  const [isCollapsed, setIsCollapsed] = useAtom(SidebarCollapseState);
  const [isMobileSidebar, setMobileSidebar] = useAtom(MobileSidebarState);
  const { theme, setTheme } = useTheme();

  // custom functions
  const logoutHandler = () => {
    signOut();
  };

  // useEffects
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "dark" ? "#111C43 !important" : "#fff !important"
          }`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#000"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        className={cn(
          "shadow-md border border-bcolor custom-sidebar md:left-0",
          isMobileSidebar ? "max-md:left-0" : "max-md:left-[-100%]"
        )}
        style={{
          position: "fixed",
          top: 0,

          height: "100vh",

          zIndex: 20,
          width: isCollapsed ? "0%" : 270,
        }}
      >
        <Menu iconShape="square">
          <SidebarTop
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <SidebarMenus
            isCollapsed={isCollapsed}
            logoutHandler={logoutHandler}
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </ProSidebar>
    </Box>
  );
};
export default AdminSidebar;
