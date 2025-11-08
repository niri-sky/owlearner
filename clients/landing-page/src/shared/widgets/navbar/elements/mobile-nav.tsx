"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// custom file imports
import { Icons } from "@/shared/utils/Icon";
import { APP_LOGO, APP_NAME } from "@/app/configs/constants";
import UserMenu from "./user-menu";
import useUserData from "@/shared/hooks/useUserData";

const MobileNavbar = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { userData } = useUserData();

  return (
    <div className="w-full py-2 lg:py-4 bg-white shadow-sm lg:hidden block sticky top-0 left-0 z-[9999]">
      <div className="container">
        <div className="flex items-center  justify-between gap-5 w-full">
          <div className="w-full flex items-center gap-5 justify-between">
            <div className="logo">
              <Link
                className="py-2 w-[123px] font-semibold text-title"
                href="/"
              >
                <Image
                  src={APP_LOGO}
                  alt={APP_NAME}
                  width={120}
                  height={120}
                  className="mb-3"
                />
              </Link>
            </div>
            <div className="text-txt cursor-pointer lg:block hidden hover:text-primary">
              Categories
            </div>
            <div className="w-full relative lg:block hidden">
              <input
                className="w-full outline-none border border-bColor rounded-full py-[11px] pl-10 pr-3"
                type="text"
                name=""
                id=""
                placeholder="Search for anythink "
              />
              <span className="absolute text-bColor left-[12px] text-[24px] top-[12px]">
                {Icons.search}
              </span>
            </div>
            {/* mobile logo */}
            <div className="lg:hidden block" onClick={() => setOpen(!open)}>
              <span className="text-[24px] text-yColor">{Icons.menuOpen}</span>
            </div>
          </div>

          <div
            onClick={() => setOpen(false)}
            className={`w-full fixed top-0 lg:hidden block opacity-0 min-h-full bg-black/40 ${
              open ? "right-0 opacity-100 z-[110]" : "-right-[100%]"
            }`}
          ></div>

          <ul
            className={`flex items-center gap-3 lg:min-w-[465px] lg:justify-between lg:flex-row lg:h-full py-6 px-4 lg:p-0 lg:shadow-none flex-col fixed lg:static top-0 min-h-full  bg-white md:w-1/2 w-[80%] transition-all ease-soft-spring duration-100  shadow-md ${
              open ? "right-0 z-[1000]" : "-right-[100%] z-[1000]"
            }`}
          >
            <li className="absolute lg:hidden block top-[10px] right-[10px]">
              <span
                onClick={() => setOpen(false)}
                className="text-[24px] text-yColor"
              >
                {Icons.menuClose}
              </span>
            </li>
            <li>
              <Link
                className="text-txt hover:text-primary"
                href="/courses"
                onClick={() => setOpen(false)}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                className="text-txt hover:text-primary"
                href="/"
                onClick={() => setOpen(false)}
              >
                Instructor
              </Link>
            </li>
            <li className="flex w-full lg:w-max  items-center gap-3 lg:flex-row flex-col">
              {userData ? (
                <UserMenu />
              ) : (
                <Link
                  className="capitalize text-primary hover:text-white px-[24px] py-[8px] w-full lg:w-max text-center bg-white rounded-full border border-primary block hover:bg-primary"
                  href="/auth"
                >
                  Join Now
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
