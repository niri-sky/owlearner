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
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";

import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useQuery } from "@apollo/client";
import { TICKETS_QUERY } from "@/graphql/queries";
import TicketViewModal from "./TicketViewModal";
import useUserData from "@/shared/hooks/useUserData";
import SolvedTicketModal from "./SolvedTicketModal";

type Props = {
  data: TicketData;
};

function TicketActions({ data }: Props) {
  const { isOpen: viewModal, onOpenChange: viewModalChange } = useDisclosure();

  const {
    isOpen: solvedModal,

    onOpenChange: solvedModalChange,
  } = useDisclosure();

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
        {data.status != "solved" ? (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem key="view" onPress={viewModalChange}>
              View
            </DropdownItem>
            <DropdownItem key="view" onPress={solvedModalChange}>
              Solved
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Static Actions" variant="flat">
            <DropdownItem key="view" onPress={viewModalChange}>
              View
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      <Modal
        placement="center"
        isOpen={viewModal}
        onOpenChange={viewModalChange}
      >
        <TicketViewModal data={data} />
      </Modal>
      <Modal isOpen={solvedModal} onOpenChange={solvedModalChange}>
        <SolvedTicketModal data={data} />
      </Modal>
    </>
  );
}

export default TicketActions;
