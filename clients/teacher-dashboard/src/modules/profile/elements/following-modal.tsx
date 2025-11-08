import React, { useState } from "react";
// global package
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
// icon
import { CiSearch } from "react-icons/ci";

const FollowingModal = ({
  isOpen,
  onOpenChange,
  data,
}: FollowersModalProps) => {
  // state
  const [scrollBehavior, setScrollBehavior] = useState<
    "inside" | "normal" | "outside" | undefined
  >("inside");

  return (
    <Modal
      scrollBehavior={scrollBehavior}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Following</ModalHeader>
            <ModalBody>
              <div className="flex flex-col w-full gap-5">
                <div className="w-full">
                  <div className="relative w-full bg-[#ececec] rounded-md">
                    <input
                      className="w-full py-2 pl-[30px] pr-2 rounded-md border border-[#dfdfdf] bg-[transparent] outline-none"
                      placeholder="Search"
                      type="search"
                      name=""
                      id=""
                    />
                    <span className="absolute left-[7px] top-[11px]">
                      <CiSearch className="text-[20px] text-[#7a7a7a]" />
                    </span>
                  </div>
                </div>
                {data.map((user: FollowersUserDataType, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-full flex items-center gap-3">
                      <div>
                        <Avatar size="lg" src={user?.userImg} />
                      </div>
                      <ul className="flex flex-col">
                        <li className="text-sm flex items-center gap-2">
                          <span className="font-medium text-txt">
                            {user?.userName}
                          </span>
                        </li>
                        <li className="capitalize text-[gray] text-sm">
                          {user?.name}
                        </li>
                      </ul>
                    </div>
                    <div className="w-full flex justify-end">
                      <Button
                        className="capitalize"
                        color="default"
                        variant="solid"
                      >
                        Following
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FollowingModal;
