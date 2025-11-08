"use client";
import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import Link from "next/link";
import { MenuItem } from "react-pro-sidebar";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                       item elements of admin sidebar                       */
/* -------------------------------------------------------------------------- */
const Item: React.FC<AdminSidebarItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
}) => {
  const pathname = usePathname();

  useEffect(() => {
    setSelected(title);
  }, [title]);

  return (
    <MenuItem
      active={selected === to || pathname === to}
      onClick={() => setSelected(to)}
      icon={icon}
    >
      <div className="w-full overflow-hidden">
        <Typography className="!text-[16px] !font-Poppins truncate">
          {title}
        </Typography>
        {to && <Link href={to} />}
      </div>
    </MenuItem>
  );
};
export default Item;
