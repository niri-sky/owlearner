import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import ViewTeacherInvoiceModal from "./ViewTeacherInvoice";

type Props = {
  data: PaymentInvoiceType;
};

function TeacherInvoiceActions({ data }: Props) {
  const { isOpen, onOpenChange } = useDisclosure();

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
          <DropdownItem onClick={onOpenChange} key="view" color="primary">
            View
          </DropdownItem>
          <DropdownItem key="download" color="primary">
            Download
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ViewTeacherInvoiceModal data={data} />
      </Modal>
    </>
  );
}

export default TeacherInvoiceActions;
