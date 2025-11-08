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
  useDisclosure,
  Modal,
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import TeacherActions from "./TeacherActions";
import { AiOutlinePlus } from "react-icons/ai";
import InviteTeacherModal from "./InviteTeacherModal";
// custop files import

type Props = {
  type: "active" | "pending";
  data: TeacherTypes[];
};

function TeachersTable({ type, data }: Props) {
  const columns: GridColDef<TeacherTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "profile",
      headerName: "Name",
      flex: 0.7,
      minWidth: 220,
      renderCell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full">
              <Image
                src={row.profile || "/user-1.jpg"}
                alt=""
                width={38}
                height={38}
                className="w-[38px] mx-[5px] h-[38px] rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm">{row.name}</div>
              <a href={`mailto:${row.email}`} className="text-[12px]">
                {row.email}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      field: "organization",
      headerName: "Organization",
      flex: 0.5,
      minWidth: 100,
      renderCell: ({ row }) => <div>{row?.organization?.name || "null"}</div>,
    },
    {
      field: "posts",
      headerName: "Posts",
      flex: 0.3,
      minWidth: 100,
      renderCell: ({ row }) => {
        return (
          <>
            <div>{row?.posts?.length || 0}</div>
          </>
        );
      },
    },

    {
      field: "courses",
      headerName: "Courses",
      flex: 0.3,
      minWidth: 100,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{row?.courses?.length || 0}</div>
          </>
        );
      },
    },
    {
      field: "joinedAt",
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
      renderCell: ({ row }) => <TeacherActions data={row} />,
    },
  ];

  const { searchProps, filterData: rows } = useSearchBar<TeacherTypes>(data);

  const { isOpen: inviteModal, onOpenChange: inviteModalChange } =
    useDisclosure();

  return (
    <div className="flex flex-col gap-4 w-full p-3 rounded-[14px] shadow-xl border border-bcolor">
      <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-between items-center gap-5">
        <div className="mb-[8px]">
          <SearchBar {...searchProps} />
        </div>
        {/* add button here */}
        <div>
          <Button
            color="primary"
            onPress={inviteModalChange}
            endContent={<AiOutlinePlus />}
            className="min-w-[40px]"
          >
            <span className="hidden sm:block">Invite Teacher</span>
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
      <Modal
        placement="center"
        isOpen={inviteModal}
        onOpenChange={inviteModalChange}
      >
        <InviteTeacherModal />
      </Modal>
    </div>
  );
}

export default TeachersTable;
