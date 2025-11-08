"use client";
import Link from "next/link";
import React from "react";
import cls from "classnames";

// custom imports
import { navItems } from "@/app/configs/constants";
import useRouteChange from "@/shared/hooks/useRouteChange";
import useSidebarActive from "@/shared/hooks/useSidebarActive";
import Sidebar from "@/shared/widgets/sidebar";

/* -------------------------------------------------------------------------- */
/*                                nav component                               */
/* -------------------------------------------------------------------------- */
const Nav = () => {
  // hooks
  const { activeRoute, setActiveRoute } = useRouteChange();
  const { isSidebarActive } = useSidebarActive();
  return (
    <>
      <div className="hidden 800px:flex">
        {navItems.map(({ name, url }: NavItemTypes, i: number) => (
          <Link href={url} key={i} passHref onClick={() => setActiveRoute(url)}>
            <span
              className={cls(
                activeRoute === url
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-white text-black",
                "text-[18px] px-6 font-Poppins font-[400]"
              )}
            >
              {name}
            </span>
          </Link>
        ))}
      </div>
      {isSidebarActive && <Sidebar />}
    </>
  );
};
export default Nav;
