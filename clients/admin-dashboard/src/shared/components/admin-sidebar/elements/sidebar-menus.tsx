"use client";
// global package imports
import { Box, Typography } from "@mui/material";
import React from "react";
import { signOut } from "next-auth/react";

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
  CategoryIcon,
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
        title="Organizations"
        to="/organizations"
        icon={<CorporateFareIcon />}
        selected={selected}
        setSelected={setSelected}
      />

      <Item
        title="Teachers"
        to="/teachers"
        icon={<BusinessCenterIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Students"
        to="/students"
        icon={<BadgeIcon />}
        selected={selected}
        setSelected={setSelected}
      />
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
        {!isCollapsed && "Courses & Support"}
      </Typography>
      <Item
        title="Courses"
        to="/courses"
        icon={<VideoCallIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Categories"
        to="/categories"
        icon={<CategoryIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Tickets"
        to="/tickets"
        icon={<ConfirmationNumberIcon />}
        selected={selected}
        setSelected={setSelected}
      />

      <Item
        title="Coupons"
        to="/coupons"
        icon={<LocalOfferIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      {/* <Item
        title="Contacts"
        to="/contacts"
        icon={<ContactsIcon />}
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
        title="Manage Team"
        to="/manage-team"
        icon={<PeopleOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
      />
      <Item
        title="Account Settings"
        to="/account-settings"
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
        title="Todo"
        to="/todo"
        icon={<FormatListBulletedIcon />}
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
