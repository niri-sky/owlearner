"use client";
import Link from "next/link";
import Image from "next/image";
import { Badge, Navbar } from "@nextui-org/react";

// custom file imports
import { Icons } from "@/shared/utils/Icon";
import { APP_LOGO, APP_NAME } from "@/app/configs/constants";
import UserMenu from "./elements/user-menu";
import useUserData from "@/shared/hooks/useUserData";
import useWishlistCart from "@/shared/hooks/useWishlistCart";
import CategoriesDropdown from "./CategoriesDropdown";

import APP_LOGO_SRC from "@/shared/assets/logo.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./logo";

const Nav = () => {
  const { cartState, wishlistState } = useWishlistCart();
  const router = useRouter();

  const { userData } = useUserData();

  const [searchTxt, setSearchTxt] = useState("");

  return (
    <Navbar className="!w-full lg:py-[10px] shadow-sm navbar lg:block hidden z-[49]">
      <div className="container m-auto">
        <div className="flex items-center  justify-between gap-5 w-full">
          <div className="w-full flex items-center gap-5 justify-between">
            <div className="logo mt-[-10px]">
              <Link className="font-semibold text-title" href="/">
                <Logo />
              </Link>
            </div>

            <CategoriesDropdown />

            <div className="w-full relative lg:block hidden">
              <input
                className="w-full outline-none border border-bColor rounded-full py-[11px] pl-10 pr-3"
                type="text"
                name=""
                id=""
                placeholder="Search for anythink "
                value={searchTxt}
                onChange={(e) => setSearchTxt(e.target.value)}
                onKeyDown={(e) => {
                  if (searchTxt.length > 0) {
                    if (e.key == "Enter") {
                      let srTxt = searchTxt;
                      setSearchTxt("");

                      router.push(
                        `/courses?search=${encodeURIComponent(srTxt)}`
                      );
                    }
                  }
                }}
              />
              <span className="absolute text-bColor left-[12px] text-[24px] top-[12px]">
                {Icons.search}
              </span>
            </div>
          </div>

          <ul className="flex items-center gap-[20px] ">
            <li>
              <Link className="text-txt hover:text-primary" href="/courses">
                Courses
              </Link>
            </li>
            <li>
              <a
                className="text-txt hover:text-primary"
                href="https://teacher.owllearner.com"
              >
                Instructor
              </a>
            </li>
            <li>
              <Link href={"/cart"}>
                <Badge content={wishlistState?.length || 0} color="primary">
                  <span className="cursor-pointer text-[26px]">
                    {Icons.heart}
                  </span>
                </Badge>
              </Link>
            </li>
            <li>
              <Link href={"/cart"}>
                <Badge content={cartState?.length || 0} color="primary">
                  <span className="cursor-pointer text-[26px]">
                    {Icons.cart}
                  </span>
                </Badge>
              </Link>
            </li>
            <li className="flex w-full lg:w-max  items-center gap-3 lg:flex-row flex-col">
              {userData ? (
                <UserMenu />
              ) : (
                <Link
                  className="capitalize text-white hover:text-primary px-[24px] py-[8px] w-full lg:w-max text-center bg-primary rounded-full border-primary border block hover:bg-white"
                  href="/auth"
                >
                  Join Now
                </Link>
              )}
              {/* <Link
                className="capitalize text-white hover:text-primary px-[24px] py-[8px] w-full lg:w-max text-center bg-primary rounded-full border-primary border block hover:bg-white"
                href="/auth"
              >
                Sign up
              </Link> */}
            </li>
          </ul>
        </div>
      </div>
    </Navbar>
  );
};

export default Nav;
