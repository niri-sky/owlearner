import React, { useState } from "react";
// global package
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
// icon
import { CiSearch } from "react-icons/ci";
import UnfollowModal from "./UnfollowModal";

type Props = {
  data?: FollowersType[];
};

const FollowersModal = ({ data }: Props) => {
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Followers</ModalHeader>
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
              {data && data?.length > 0 ? (
                data?.map((user: FollowersType, i) => (
                  <FollowerItem key={"sdg" + i} data={user} />
                ))
              ) : (
                <div className="pb-5">No followers</div>
              )}
              <div className="pb-5"></div>
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  );
};

type ItemProps = {
  data: FollowersType;
};
function FollowerItem({ data }: ItemProps) {
  const { isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-full flex items-center gap-3">
          <div>
            <Avatar size="lg" src={data?.student?.profile || "/user-1.jpg"} />
          </div>
          <ul className="flex flex-col">
            <li className="text-sm flex items-center gap-2">
              <span className="font-medium text-txt">
                {data?.student?.name}
              </span>
            </li>
            <li className="capitalize text-[gray] text-sm">
              {data?.student?.email}
            </li>
          </ul>
        </div>
        <div className="w-full flex justify-end">
          <Button onClick={onOpenChange} color="default" variant="solid">
            Remove
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <UnfollowModal data={data} />
      </Modal>
    </>
  );
}

export default FollowersModal;
