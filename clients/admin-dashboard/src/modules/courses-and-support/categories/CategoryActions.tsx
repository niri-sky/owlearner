import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  useDisclosure,
  Modal,
} from "@nextui-org/react";
import { HiDotsVertical } from "react-icons/hi";
import useUserData from "@/shared/hooks/useUserData";
import CategoryModal from "./CategoryModal";
import CategoryDeleteModal from "./CategoryDeleteModal";

type Props = {
  data: CategoryDataType;
};

function CategoryActions({ data }: Props) {
  const { isAdmin } = useUserData();

  const { isOpen: deleteModal, onOpenChange: deleteModalChange } =
    useDisclosure();

  const { isOpen: viewModal, onOpenChange: viewModalChange } = useDisclosure();

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
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem onClick={viewModalChange} key="view">
              View
            </DropdownItem>
            <DropdownItem onClick={deleteModalChange} key="delete">
              Delete
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem onClick={viewModalChange} key="view">
              View
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      <Modal
        placement="center"
        scrollBehavior="outside"
        size="2xl"
        isOpen={viewModal}
        onOpenChange={viewModalChange}
      >
        <CategoryModal data={data} type="edit" />
      </Modal>
      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <CategoryDeleteModal data={data} />
      </Modal>
    </>
  );
}

export default CategoryActions;
