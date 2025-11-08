"use client";
// global pakage imports
import Link from "next/link";
import React from "react";
import cls from "classnames";

// custom file imports
import { navItems } from "@/app/configs/constants";
import useRouteChange from "@/shared/hooks/useRouteChange";

/* -------------------------------------------------------------------------- */
/*                             sidebar components                             */
/* -------------------------------------------------------------------------- */
const Sidebar = () => {
  // hooks
  const { activeRoute } = useRouteChange();
  return (
    <div className="800px:hidden mt-5">
      {/* <div className="w-full text-center py-6">
    <Link href={"/"} passHref>
      <span
        className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
      >
        {APP_NAME}
      </span>
    </Link>
  </div> */}
      {navItems.map(({ name, url }: NavItemTypes, i: number) => (
        <Link href="/" passHref key={i}>
          <span
            className={cls(
              activeRoute === url
                ? "dark:text-[#37a39a] text-[crimson]"
                : "dark:text-white text-black",
              "block py-5 text-[18px] px-6 font-Poppins font-[400]"
            )}
          >
            {name}
          </span>
        </Link>
      ))}
    </div>
  );
};
export default Sidebar;
