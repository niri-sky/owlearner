import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  useDisclosure,
  Modal,
} from "@nextui-org/react";
import { HiDotsVertical } from "react-icons/hi";
import useUserData from "@/shared/hooks/useUserData";
import CourseDeclineModal from "./CoursesDeclineModal";
import CourseApproveModal from "./CourseApproveModal";
import rswitch from "rswitch";
import { useParams, useRouter } from "next/navigation";

type Props = {
  data: CourseDataTypes;
  type: "live" | "pending" | "declined";
};

function CoursesActions({ data, type }: Props) {
  const {
    isOpen: declineModal,

    onOpenChange: declineModalChange,
  } = useDisclosure();
  const {
    isOpen: approveModal,

    onOpenChange: approveModalChange,
  } = useDisclosure();

  const { isAdmin } = useUserData();

  const router = useRouter();

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
          rswitch(type, {
            live: (
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="view"
                  onClick={() => {
                    router.push("/course-details/" + data?.slug);
                  }}
                >
                  View
                </DropdownItem>

                <DropdownItem key="decline" onClick={declineModalChange}>
                  Decline
                </DropdownItem>
              </DropdownMenu>
            ),
            pending: (
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="view"
                  onClick={() => {
                    router.push("/course-details/" + data?.slug);
                  }}
                >
                  View
                </DropdownItem>

                <DropdownItem key="approve" onClick={approveModalChange}>
                  Approve
                </DropdownItem>
                <DropdownItem key="decline" onClick={declineModalChange}>
                  Decline
                </DropdownItem>
              </DropdownMenu>
            ),
            declined: (
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="view"
                  onClick={() => {
                    router.push("/course-details/" + data?.slug);
                  }}
                >
                  View
                </DropdownItem>

                <DropdownItem key="approve" onClick={approveModalChange}>
                  Approve
                </DropdownItem>
              </DropdownMenu>
            ),
          })
        ) : (
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="view"
              onClick={() => {
                router.push("/course-details/" + data?.slug);
              }}
            >
              View
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      <Modal isOpen={declineModal} onOpenChange={declineModalChange}>
        <CourseDeclineModal data={data} />
      </Modal>
      <Modal isOpen={approveModal} onOpenChange={approveModalChange}>
        <CourseApproveModal data={data} />
      </Modal>
    </>
  );
}

export default CoursesActions;
