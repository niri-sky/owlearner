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
  useDisclosure,
} from "@nextui-org/react";
// custop files import

import AdminLayout from "@/shared/components/admin-layout";
import { useMemo, useState } from "react";

import { formatDate } from "@/shared/utils";

import { AiOutlinePlus } from "react-icons/ai";
import AddNewTeacherModal from "./AddNewTeacherModal";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";

export const fakeTeachersData = [...Array(20)].map((_, i) => ({
  id: i + 1,
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  teachers: faker.person.fullName(),
  courses: faker.number.int(50),
  posts: faker.number.int(100),
  join: faker.date.past(),
}));

const Teachers = () => {
  const columns: GridColDef<TeacherTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "avatar",
      headerName: "Name",
      flex: 0.7,
      minWidth: 220,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full">
              <Image
                src={params.row.avatar}
                alt=""
                width={38}
                height={38}
                className="w-[38px] mx-[5px] h-[38px] rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm">{params.row.teachers}</div>
              <a href={`mailto:${params.row.email}`} className="text-[12px]">
                {params.row.email}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      field: "posts",
      headerName: "Posts",
      flex: 0.3,
      minWidth: 100,
      renderCell: (params: any) => {
        return (
          <>
            <div>{params.row.posts}</div>
          </>
        );
      },
    },

    {
      field: "courses",
      headerName: "Courses",
      flex: 0.3,
      minWidth: 100,
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.courses}</div>
          </>
        );
      },
    },
    {
      field: "join",
      headerName: "Joined At",
      flex: 0.4,
      minWidth: 100,
      valueFormatter: (pa) => formatDate(pa.value),
    },
    {
      field: "  ",
      headerName: "Actions",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params: any) => {
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
                <DropdownItem key="new">View</DropdownItem>
                <DropdownItem key="edit" color="danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const {
    isOpen: isTeacherModalOpen,
    onOpen: openTeacherModal,
    onOpenChange: onTeacherModalChange,
  } = useDisclosure();

  const { searchProps, filterData: rows } =
    useSearchBar<TeacherTypes>(fakeTeachersData);

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
        <div className="flex flex-col gap-4 w-full p-3 rounded-[14px] shadow-xl border border-bcolor">
          <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-between items-center gap-5">
            <div className="mb-[8px]">
              <SearchBar {...searchProps} />
            </div>
            {/* add button here */}
            <div>
              <Button
                color="primary"
                onPress={() => openTeacherModal()}
                endContent={<AiOutlinePlus />}
                className="min-w-[40px]"
              >
                <span className="hidden sm:block">Add new</span>
              </Button>
            </div>
          </div>
          <div className="w-full">
            <Box>
              <Box
                height="90vh"
                className="rounded-md"
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "none",
                    outline: "none",
                  },
                  "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                    color: "#2a3547",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: "#2a3547",
                  },
                  "& .MuiDataGrid-row": {
                    color: "#2a3547",
                    borderBottom: "1px solid #2a3547fff30!important",
                  },
                  "& .MuiTablePagination-root": {
                    color: "#2a3547",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none!important",
                  },
                  "& .name-column--cell": {
                    color: "#2a3547",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#F4F4F5",
                    borderBottom: "none",
                    color: "#2a3547",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: "#fff",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    color: "dark",
                    borderTop: "none",
                    backgroundColor: "#F4F4F5",
                  },
                  "& .MuiCheckbox-root": {
                    color: `#b7ebde !important`,
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `#2a3547 !important`,
                  },
                  "& .css-ptkaw2-MuiDataGrid-root .MuiDataGrid-row.Mui-selected":
                    {
                      backgroundColor: `#e0e0e0`,
                    },
                  "& .css-ptkaw2-MuiDataGrid-root .MuiDataGrid-row.Mui-selected:hover":
                    {
                      backgroundColor: `#F4F4F5`,
                    },
                }}
              >
                <DataGrid rows={rows} columns={columns} />
              </Box>
            </Box>
          </div>
        </div>
      </div>
      <AddNewTeacherModal
        isOpen={isTeacherModalOpen}
        onOpenChange={onTeacherModalChange}
      />
    </AdminLayout>
  );
};

export default Teachers;
