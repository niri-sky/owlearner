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
import CoursesTable from "./CoursesTable";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { COURSES_QUERY } from "@/graphql/queries";
// custop files import

const AllCourses = () => {
  const { data } = useQuery(COURSES_QUERY);

  const { liveData, pendingData, declinedData } = useMemo(() => {
    const courses: CourseDataTypes[] = data?.courses || [];

    const liveData = courses.filter((v) => v.status === "live");
    const pendingData = courses.filter((v) => v.status === "pending");
    const declinedData = courses.filter((v) => v.status === "declined");

    return { liveData, pendingData, declinedData };
  }, [data]);

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Courses</h2>
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
                  <CoursesTable data={liveData} type="live" />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="pending" title="Pending">
              <Card>
                <CardBody>
                  {/* pending tab table */}
                  <CoursesTable data={pendingData} type="pending" />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="declined" title="Declined">
              <Card>
                <CardBody>
                  {/* pending tab table */}
                  <CoursesTable data={declinedData} type="declined" />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllCourses;
