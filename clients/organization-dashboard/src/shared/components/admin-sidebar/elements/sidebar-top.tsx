"use client";
// global package imports
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import LogoImg from "./owl_text_no_bg.png";
// custom file imports
import { ArrowBackIosIcon, ArrowForwardIosIcon } from "./icons";
// import avatar from "@/assets/avatar.png";
import { APP_NAME } from "@/app/configs/constants";
import useUserData from "@/shared/hooks/useUserData";

import APP_LOGO_SRC from "@/shared/logo.svg";

/* -------------------------------------------------------------------------- */
/*                    admin sidebar logo and menu elements                    */
/* -------------------------------------------------------------------------- */
const SidebarTop: React.FC<AdminSidebarTopProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const { userData } = useUserData();

  return (
    <>
      {/* <MenuItem
        onClick={() => setIsCollapsed(false)}
        icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
        style={{
          margin: "10px 0 20px 0",
        }}
      > */}
      {!isCollapsed ? (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml="20px"
          mt="15px"
        >
          <Link href="/" className="block relative">
            {/* <p className="text-[20px] font-bold text-[#473EAE] font-Poppins uppercase  w-[172px] ">
              {APP_NAME}
            </p> */}
            <Image src={APP_LOGO_SRC} alt="logo" width={150} height={100} />
          </Link>
          {/* <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="inline-block w-[50px] h-[50px]"
          > */}
          <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="cursor-pointer p-2 mr-1"
          >
            <ArrowBackIosIcon className="text-black text-txt" />
          </div>
          {/* </IconButton> */}
        </Box>
      ) : (
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="cursor-pointer mt-4 flex items-center justify-center"
        >
          <ArrowForwardIosIcon className="text-black text-txt" />
        </div>
      )}
      <div className="pt-5"></div>
      {/* </MenuItem> */}
      {!isCollapsed && (
        <Box mb="25px">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image
              alt="profile-user"
              width={100}
              height={100}
              // src={user.avatar ? user.avatar.url : ""}
              src={userData?.profile || "/user-1.jpg"}
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                border: "3px solid #5b6fe6",
                width: "100px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box textAlign="center">
            <Typography
              variant="h4"
              className="!text-[20px] text-black text-txt"
              sx={{ m: "10px 0 0 0" }}
            >
              {/* {user?.name} */}
              {userData?.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{ m: "10px 0 0 0" }}
              className="!text-[20px] text-black text-txt capitalize"
            >
              {/* - {user?.role} */}
              Organization
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};
export default SidebarTop;
