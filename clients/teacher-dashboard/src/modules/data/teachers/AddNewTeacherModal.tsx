import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Modal,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";

function AddNewTeacherModal(props: Omit<ModalProps, "children">) {
  return (
    <Modal placement="center" {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
              Add new Teacher
            </ModalHeader>
            <ModalBody>
              <div className="flex w-full flex-col gap-3">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="">Teacher name</label>
                  <input
                    placeholder="Name"
                    className="py-3 px-2 border
               border-bcolor
               outline-none rounded-md"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="">Email</label>
                  <input
                    placeholder="abc@gmail.com"
                    className="py-3 px-2 border
               border-bcolor
               outline-none rounded-md"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onClose}>
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddNewTeacherModal;
