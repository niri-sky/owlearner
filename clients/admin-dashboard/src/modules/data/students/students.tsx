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
import StudentTable from "./StudentTable";
import { useQuery } from "@apollo/client";
import { STUDENTS_QUERY } from "@/graphql/queries";
import { useMemo } from "react";
// custop files import



const Students = () => {

  const { data } = useQuery(STUDENTS_QUERY);

  const { activeStudents, bannedStudents } = useMemo(() => {
    const students: StudentTypes[] = data?.students || [];
    const activeStudents = students.filter((v) => v.status === "active");
    const bannedStudents = students.filter((v) => v.status === "banned");
    return { activeStudents, bannedStudents };
  }, [data]);

 
  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Student</h2>
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
                  <StudentTable type="active" data={activeStudents} />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="banned" title="Banned">
              <Card>
                <CardBody>
                  {/* pending tab table */}
                  <StudentTable type="banned" data={bannedStudents} />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
 
      </div>
    </AdminLayout>
  );
};

export default Students;
