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
import CoursesActions from "./CoursesActions";
// custop files import

type Props = {
  data: CourseDataTypes[];
  type: "live" | "pending" | "declined";
};

function CoursesTable({ data, type }: Props) {
  const columns: GridColDef<CourseDataTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "profile",
      headerName: "Teachers Name",
      flex: 0.9,
      minWidth: 220,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full">
              <Image
                src={params.row.teacher.profile || "/user-1.jpg"}
                alt=""
                width={38}
                height={38}
                className="w-[38px] mx-[5px] h-[38px] rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm">{params.row.teacher.name}</div>
              <a
                href={`mailto:${params.row.teacher.email}`}
                className="text-[12px]"
              >
                {params.row.teacher.email}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      field: "title",
      headerName: "Course Title",
      flex: 0.7,
      minWidth: 150,
    },
    {
      field: "price",
      headerName: "Course Price",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.price}</div>
          </>
        );
      },
    },
    {
      field: "invoices",
      headerName: "Sales",
      flex: 0.4,
      minWidth: 80,

      renderCell: (params) => {
        return (
          <>
            <div className="w-[50%] mx-auto">
              {params.row.invoices.length || 0}
            </div>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return <div className="">{params.row.status}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.6,
      minWidth: 100,
      valueFormatter: (pa) => formatDate(pa.value),
    },
    {
      field: "  ",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 80,
      renderCell: (params) => <CoursesActions data={params.row} type={type} />,
    },
  ];

  const { filterData: rows, searchProps } = useSearchBar<CourseDataTypes>(data);

  return (
    <div className="flex flex-col gap-4 w-full p-3 rounded-[14px] shadow-xl border border-bcolor">
      <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-start items-start gap-5">
        <div className="mb-[8px]">
          <SearchBar {...searchProps} />
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
              "& .css-ptkaw2-MuiDataGrid-root .MuiDataGrid-row.Mui-selected": {
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
  );
}

export default CoursesTable;
