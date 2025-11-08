import React from "react";
import { CouponDataTypes } from "./index";
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
} from "@nextui-org/react";
import CreateCouponModal from "./CreateCouponModal";
import { HiDotsVertical } from "react-icons/hi";
import DeleteCouponModal from "./DeleteCouponModal";

type Props = {
  data: CouponDataTypes;
  courseData: any[];
};

function CouponActions({ data, courseData }: Props) {
  const { isOpen: viewModal, onOpenChange: viewModalChange } = useDisclosure();
  const { isOpen: deleteModal, onOpenChange: deleteModalChange } =
    useDisclosure();

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
          <DropdownItem key="new" onPress={viewModalChange}>
            View
          </DropdownItem>
          <DropdownItem key="new" color="danger" onPress={deleteModalChange}>
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={viewModal} onOpenChange={viewModalChange}>
        <CreateCouponModal
          prevData={data}
          courseData={courseData}
          type="edit"
        />
      </Modal>
      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <DeleteCouponModal data={data} />
      </Modal>
    </>
  );
}

export default CouponActions;
