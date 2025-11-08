"use client";
import React, { useEffect, useState } from "react";
import cls from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";

// custom file imports
import useSidebarActive from "@/shared/hooks/useSidebarActive";
import Nav from "@/shared/widgets/nav";
import ThemeSwitcher from "@/shared/components/theme-switcher";
import useRouteChange from "@/shared/hooks/useRouteChange";
import useModalOpen from "@/shared/hooks/useModalOpen";
import { APP_NAME } from "@/app/configs/constants";

/* -------------------------------------------------------------------------- */
/*                              header component                              */
/* -------------------------------------------------------------------------- */
const Header = () => {
  // states
  const [sticky, setSticky] = useState(false);
  const pathname = usePathname();

  // jotai hooks
  const { activeRoute, setActiveRoute } = useRouteChange();
  const { open, setOpen } = useModalOpen();
  const { isSidebarActive, setToggleSidebar } = useSidebarActive();

  //   custom func
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    });
  }

  // useEffects
  useEffect(() => {
    setActiveRoute(pathname as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <>
      {activeRoute?.includes("/admin ") || pathname?.includes("/admin") ? (
        <></>
      ) : (
        <header className="w-full relative">
          <div
            className={cls(
              sticky
                ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
            )}
          >
            <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
              <div className="w-full h-[80px] flex items-center justify-between p-3">
                <Link
                  href={"/"}
                  className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                >
                  {APP_NAME}
                </Link>
                <div className="flex items-center">
                  <Nav />
                  <ThemeSwitcher />
                  {/* only for mobile */}
                  {/* {me ? (
                    <Link href="/profile">
                      <Image
                        src={me?.avatar ? me?.avatar.url : avatar}
                        alt=""
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] rounded-full cursor-pointer"
                        // style={{border: activeItem === 5 ? "2px solid #37a39a" : "none"}}
                      />
                    </Link>
                  ) : (
                    <HiOutlineUserCircle
                      size={25}
                      className="cursor-pointer dark:text-white text-black mr-4"
                      onClick={() =>
                        [setOpen(true), setActiveRoute("/signin")].map(
                          (func) => func
                        )
                      }
                    />
                  )} */}
                  <div className="800px:hidden">
                    <HiOutlineMenuAlt3
                      size={25}
                      className="cursor-pointer dark:text-white text-black"
                      onClick={() => setToggleSidebar(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* if sidebar active then open this */}
            {isSidebarActive && (
              <div
                className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                onClick={(e: any) => {
                  if (e.target.id === "screen") {
                    setToggleSidebar(false);
                  }
                }}
                id="screen"
              >
                <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                  <Nav />
                  <HiOutlineUserCircle
                    size={25}
                    className="hidden 800px:block cursor-pointer dark:text-white text-black"
                    // onClick={() => setOpen(true)}
                  />
                  {/* <CopyRights /> */}
                </div>
              </div>
            )}
          </div>
          {/* {activeRoute === "/signin" && open && (
            <Modal
              Component={signIn}
              open={open}
              setOpen={setOpen}
              activeRoute={activeRoute}
              setRoute={setActiveRoute}
            />
          )}
          {activeRoute === "/signup" && open && (
            <Modal
              Component={signUp}
              open={open}
              setOpen={setOpen}
              activeRoute={activeRoute}
              setRoute={setActiveRoute}
            />
          )}
          {activeRoute === "/verifyotp" && open && (
            <Modal
              Component={otpVerification}
              open={open}
              setOpen={setOpen}
              activeRoute={activeRoute}
              setRoute={setActiveRoute}
            />
          )} */}
        </header>
      )}
    </>
  );
};
export default Header;
