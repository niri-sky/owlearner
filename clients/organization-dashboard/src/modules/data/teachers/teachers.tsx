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
  Tabs,
  Tab,
  Card,
  CardBody,
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import TeachersTable from "./TeachersTable";
import { useQuery } from "@apollo/client";
import { ORGANIZATION_EARNING, TEACHERS_QUERY } from "@/graphql/queries";
import { useMemo } from "react";
import useUserData from "@/shared/hooks/useUserData";
// custop files import

const Teachers = () => {
  const { userData } = useUserData();

  const { data } = useQuery(TEACHERS_QUERY, {
    variables: {
      where: {
        organizationId: { equals: Number(userData?.id) },
      },
    },
  });

  const { activeTeachers, pendingTeachers } = useMemo(() => {
    const teachers: TeacherTypes[] = data?.teachers || [];
    const activeTeachers = teachers.filter((v) => v.status === "active");
    const pendingTeachers = teachers.filter((v) => v.status === "pending");
    return { activeTeachers, pendingTeachers };
  }, [data]);

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Teacher</h2>
          <div className="absolute top-[20px] right-[19px]">
            <Image
              width={165}
              height={100}
              src={
                "https://modernize-angular-main.netlify.app/assets/images/breadcrumb/ChatBc.png"
              }
              alt="employee image"
            />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" color="primary" size="lg">
            <Tab key="active" title="Active">
              <Card>
                <CardBody>
                  {/* active tab table */}
                  <TeachersTable type="active" data={activeTeachers} />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="pending" title="Pending">
              <Card>
                <CardBody>
                  {/* pending tab table */}
                  <TeachersTable type="pending" data={pendingTeachers} />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Teachers;
