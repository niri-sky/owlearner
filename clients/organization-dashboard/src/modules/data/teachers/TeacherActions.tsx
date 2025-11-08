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
import AdminLayout from "@/shared/components/admin-layout";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import TeacherViewModal from "./TeacherViewModal";
import TeacherDeleteModal from "./TeacherDeleteModal";
import useUserData from "@/shared/hooks/useUserData";
// custop files import

type Props = {
  data: TeacherTypes;
};

function TeacherActions({ data }: Props) {
  const {
    isOpen: viewModal,

    onOpenChange: viewModalChange,
  } = useDisclosure();
  const {
    isOpen: deleteModal,

    onOpenChange: deleteModalChange,
  } = useDisclosure();

  const { isEditor } = useUserData();

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
        {isEditor ? (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem onClick={viewModalChange} key="new">
              View
            </DropdownItem>
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
        <TeacherViewModal data={data} />
      </Modal>

      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <TeacherDeleteModal data={data} />
      </Modal>
    </>
  );
}

export default TeacherActions;
