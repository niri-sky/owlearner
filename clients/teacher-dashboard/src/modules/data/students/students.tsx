"use client";
// global package
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@nextui-org/react";
// custop files import

import AdminLayout from "@/shared/components/admin-layout";

const Students = () => {
  const columns = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "avatar",
      headerName: "Name",
      flex: 0.6,
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
              <div className="text-sm">{params.row.students}</div>
              <a href={`mailto:${params.row.email}`} className="text-[12px]">
                {params.row.email}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      field: "course_enrolled",
      headerName: "Course Enrolled",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.course_enrolled}</div>
          </>
        );
      },
    },
    { field: "join", headerName: "Joined At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Actions",
      flex: 0.2,
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
                <DropdownItem key="new" color="danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const rows: StudentTypes[] = [];

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
        <div className="flex flex-col gap-4 w-full p-3 rounded-[14px] shadow-xl border border-bcolor">
          <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-start items-start gap-5">
            <div className="mb-[8px]">
              <Input
                classNames={{
                  base: "max-w-full  h-10",
                  mainWrapper: "h-full",
                }}
                style={{ backgroundColor: "transparent" }}
                placeholder="Search here"
                size="sm"
                startContent={<IoIosSearch size={18} />}
                type="search"
              />
            </div>
            {/* add button here */}
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
    </AdminLayout>
  );
};

export default Students;
