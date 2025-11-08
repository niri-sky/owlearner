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
import useUserData from "@/shared/hooks/useUserData";
import OrganizationViewModal from "./OrganizationViewModal";
import OrganizationDeleteModal from "./OrganizationDeleteModal";

type Props = {
  data: OrganizationTypes;
};

function OrganizationActions({ data }: Props) {
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

        <DropdownMenu aria-label="Static Actions" variant="flat">
          <DropdownItem onClick={viewModalChange} key="new">
            View
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={viewModal} onOpenChange={viewModalChange}>
        <OrganizationViewModal data={data} />
      </Modal>

      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <OrganizationDeleteModal data={data} />
      </Modal>
    </>
  );
}

export default OrganizationActions;
