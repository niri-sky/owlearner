// global package
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
// custom files import
import { pendingDatas } from "./data";

const Pending = () => {
  const columns = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "avatar",
      headerName: "Name",
      flex: 0.7,
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
      field: "teachers",
      headerName: "Teachers",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.teachers}</div>
          </>
        );
      },
    },
    { field: "courses", headerName: "Courses", flex: 0.3,renderCell: (params: any) => {
      return (
        <>
          <div className="w-[50%] mx-auto">{params.row.courses}</div>
        </>
      );
    }, },
    {
      field: "total",
      headerName: "Total Sales",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.total}</div>
          </>
        );
      },
    },
    { field: "join", headerName: "Joined At", flex: 0.4 },
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
                <DropdownItem key="new" color="success">Approve</DropdownItem>
                <DropdownItem key="edit" color="danger">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const rows: PendingTypes[] = [];

  pendingDatas &&
    pendingDatas.forEach((pending: PendingTypes) => {
      rows.push({
        id: pending?.id,
        email: pending?.email,
        avatar: pending?.avatar,
        teachers: pending?.teachers,
        courses: pending?.courses,
        total: pending?.total,
        join: pending?.join,
        name: pending?.name,
      });
    });
  return (
    <>
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
            }}
          >
            <DataGrid rows={rows} columns={columns} />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Pending;
