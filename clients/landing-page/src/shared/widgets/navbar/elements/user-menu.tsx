"use client";
import React from "react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUserData from "@/shared/hooks/useUserData";
import { signOut } from "next-auth/react";

const UserMenu = () => {
  const { userData } = useUserData();

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          src={userData?.profile || "/user-1.jpg"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Link Actions">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{userData?.name}</p>
          <p className="font-semibold line-clamp-1">{userData?.email}</p>
        </DropdownItem>
        <DropdownItem
          key="dashboard"
          closeOnSelect={false}
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </DropdownItem>
        <DropdownItem
          key="profile"
          closeOnSelect={false}
          onClick={() => router.push("/profile")}
        >
          Profile
        </DropdownItem>
        <DropdownItem onClick={handleLogout} key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default UserMenu;
