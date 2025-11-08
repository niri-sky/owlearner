"use client";
// global package
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Tabs,
  Tab,
  useDisclosure,
  Modal,
} from "@nextui-org/react";
// custop files import

import StudentViewModal from "./StudentViewModal";

import useUserData from "@/shared/hooks/useUserData";
import StudentBannedModal from "./StudentBannedModal";
// custop files import

type Props = {
  data: StudentTypes;
  type: "active" | 'banned'
};

function StudentActions({ data ,type}: Props) {
  const {
    isOpen: viewModal,

    onOpenChange: viewModalChange,
  } = useDisclosure();
  const {
    isOpen: deleteModal,

    onOpenChange: deleteModalChange,
  } = useDisclosure();

  const { isAdmin } = useUserData();

  return (
    <>
      <Dropdown>
        <DropdownTrigger className="!bg-[transparent]">
          <Button className="!bg-[transparent]">
            <HiDotsVertical
              className="dark:text-white text-black cursor-pointer"
              size={16}
            />
          </Button>
        </DropdownTrigger>
        {isAdmin ? (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem onClick={viewModalChange} key="new">
              View
            </DropdownItem>
            {type === "banned" ? (

              <DropdownItem onClick={deleteModalChange} key="edit" color="danger">
              Unbanned
            </DropdownItem>
              ):(
                <DropdownItem onClick={deleteModalChange} key="edit" color="danger">
                Banned
              </DropdownItem>
              )}
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem onClick={viewModalChange} key="new">
              View
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      <Modal isOpen={viewModal} onOpenChange={viewModalChange}>
        <StudentViewModal data={data} type={type} />
      </Modal>

      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <StudentBannedModal type={type} data={data} />
      </Modal>
    </>
  );
}

export default StudentActions;
