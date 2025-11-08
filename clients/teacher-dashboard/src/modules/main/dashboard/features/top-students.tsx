"use client";
// global package imports
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Select, SelectItem } from "@nextui-org/react";
// custop files import

import { faker } from "@faker-js/faker";
import { formatDate } from "@/shared/utils";
// custop files import

type Props = {
  data: TopStudentTypes[];
};

const TopStudents = ({ data }: Props) => {
  const columns: GridColDef<TopStudentTypes>[] = [
    {
      field: "avatar",
      headerName: "Assigned",
      flex: 0.8,
      minWidth: 220,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full">
              <Image
                src={params.row.profile || "/user-1.jpg"}
                alt=""
                width={38}
                height={38}
                className="w-[38px] mx-[5px] h-[38px] rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm">{params.row.name}</div>
              <a href={`mailto:${params.row.email}`} className="text-[12px]">
                {params.row.email}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      field: "courseSales",
      headerName: "Course Purchased",
      flex: 0.3,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <div className="w-[70%] mx-auto">
              {params.row?.courseSales?.length || 0}
            </div>
          </>
        );
      },
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      flex: 0.3,
      minWidth: 120,
      valueFormatter: (pa) => formatDate(pa.value),
    },
  ];

  return (
    <div className="flex flex-col gap-4" id="top-students">
      <div className="flex justify-between gap-5 items-center">
        <div className="flex flex-col">
          <h3 className="text-[20px] font-semibold capitalize text-txt">
            Top students
          </h3>
          <p className="text-[15px] text-txt">Best perfomance</p>
        </div>
      </div>
      {/* table */}
      <div className="w-full">
        <Box>
          <Box
            height="420px"
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
            <DataGrid rows={data} columns={columns} />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default TopStudents;
