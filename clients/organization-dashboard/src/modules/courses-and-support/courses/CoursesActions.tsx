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
import { useRouter } from "next/navigation";

type Props = {
  data: CourseDataTypes;
  type: "live" | "pending" | "declined";
};

function CoursesActions({ data, type }: Props) {
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
      </Dropdown>
    </>
  );
}

export default CoursesActions;
