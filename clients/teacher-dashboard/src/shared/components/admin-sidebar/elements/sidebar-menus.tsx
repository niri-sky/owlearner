"use client";
// global package imports
import { Box, Typography } from "@mui/material";
import React from "react";
import VideoChatIcon from "@mui/icons-material/Videocam";
// custom file imports
import {
  BadgeIcon,
  BarChartIcon,
  BusinessCenterIcon,
  ConfirmationNumberIcon,
  ContactsIcon,
  CorporateFareIcon,
  DirectionsIcon,
  ExitToAppIcon,
  FormatListBulletedIcon,
  HomeOutlinedIcon,
  ManageAccountsIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  VideoCallIcon,
} from "./icons";
import Item from "./item";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
/* -------------------------------------------------------------------------- */
/*                         admin sidebar menu elements                        */
/* -------------------------------------------------------------------------- */
const SidebarMenus: React.FC<AdminSidebarMenuProps> = ({
  isCollapsed,
  selected,
  setSelected,
  logoutHandler,
}) => {
  console.log(selected);
  return (
    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
      <Item
        title="Dashboard"
        to="/dashboard"
        icon={<HomeOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />

      <Typography
        variant="h5"
        sx={{ m: "15px 0 5px 25px" }}
        className="!text-[18px] text-black text-txt capitalize !font-[400]"
      >
        {!isCollapsed && "Data"}
      </Typography>

      <Item
        title="Invoices"
        to="/invoices"
        icon={<ReceiptOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />

      <Typography
        variant="h5"
        className="!text-[18px] text-black text-txt capitalize !font-[400]"
        sx={{ m: "15px 0 5px 20px" }}
      >
        {!isCollapsed && "Courses"}
      </Typography>

      <Item
        title="Create Course"
        to="/create-course"
        icon={<VideoCallIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Courses"
        to="/courses"
        icon={<VideoChatIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      {/* 
      <Item
        title="Coupons"
        to="/coupons"
        icon={<LocalOfferIcon />}
        selected={selected}
        setSelected={setSelected}
      /> */}

      <Typography
        variant="h5"
        className="!text-[18px] text-black text-txt capitalize !font-[400]"
        sx={{ m: "15px 0 5px 20px" }}
      >
        {!isCollapsed && "Controllers"}
      </Typography>

      <Item
        title="Account Settings"
        to="/profile"
        icon={<ManageAccountsIcon />}
        selected={selected}
        setSelected={setSelected}
      />

      <Typography
        variant="h5"
        className="!text-[18px] text-black text-txt capitalize !font-[400]"
        sx={{ m: "15px 0 5px 20px" }}
      >
        {!isCollapsed && "Analytics"}
      </Typography>

      <Item
        title={"Analytics"}
        to="/analytics"
        icon={<BarChartIcon />}
        selected={selected}
        setSelected={setSelected}
      />

      <Typography
        variant="h6"
        className="!text-[18px] text-black text-txt capitalize !font-[400]"
        sx={{ m: "15px 0 5px 20px" }}
      >
        {!isCollapsed && "Extras"}
      </Typography>
      <Item
        title="Tickets"
        to="/tickets"
        icon={<ConfirmationNumberIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <div onClick={logoutHandler}>
        <Item
          title="Logout"
          icon={<ExitToAppIcon />}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </Box>
  );
};
export default SidebarMenus;
