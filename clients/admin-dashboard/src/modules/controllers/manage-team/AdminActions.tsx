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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  cn,
  Spinner,
} from "@nextui-org/react";
// custop files import

import * as yup from "yup";
import { useState } from "react";

import AddNewAdminModal from "./AddNewAdminModal";
import ViewAdminModal from "./ViewAdminModal";
import DeleteAdminModal from "./DeleteAdminModal";
import useUserData from "@/shared/hooks/useUserData";

type Props = {
  data: ManageTeamDataTypes;
};

function AdminActions({ data }: Props) {
  const { isAdmin, userData } = useUserData();

  const {
    isOpen: viewModal,

    onOpenChange: viewModalChange,
  } = useDisclosure();
  const {
    isOpen: deleteModal,

    onOpenChange: deleteModalChange,
  } = useDisclosure();

  console.log(isAdmin);

  const isOwnAccount = userData?.id == data.id;

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

        {isAdmin && !isOwnAccount ? (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem onPress={viewModalChange} key="view">
              View
            </DropdownItem>

            <DropdownItem
              key="delete"
              color="danger"
              onClick={deleteModalChange}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem onPress={viewModalChange} key="view">
              View
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>

      <Modal isOpen={viewModal} onOpenChange={viewModalChange}>
        <ViewAdminModal data={data} />
      </Modal>

      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <DeleteAdminModal data={data} />
      </Modal>
    </>
  );
}

export default AdminActions;
