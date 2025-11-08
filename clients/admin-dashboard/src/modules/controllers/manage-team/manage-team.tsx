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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  cn,
  Spinner,
} from "@nextui-org/react";
// custop files import

import AdminLayout from "@/shared/components/admin-layout";
import { AiOutlinePlus } from "react-icons/ai";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useMutation, useQuery } from "@apollo/client";
import { ADMINS_QUERY, DELETE_ADMIN, INVITE_ADMIN } from "@/graphql/queries";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { useState } from "react";

import AddNewAdminModal from "./AddNewAdminModal";
import AdminActions from "./AdminActions";

const ManageTeam = () => {
  const { data, loading } = useQuery(ADMINS_QUERY);

  const {
    isOpen: isMemberOpen,
    onOpen: isMemberOnOpen,
    onOpenChange: isMemberOnOpenChange,
  } = useDisclosure();

  const columns: GridColDef<ManageTeamDataTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "profile",
      headerName: "Name",
      flex: 0.6,
      minWidth: 240,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full">
              <Image
                src={params.row?.profile || "/user-1.jpg"}
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
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 60,
      renderCell: (params: any) => {
        return (
          <>
            <div className="capitalize">{params.row.role}</div>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 60,
      renderCell: (params: any) => {
        return (
          <>
            <div className="capitalize">{params.row.status}</div>
          </>
        );
      },
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      flex: 0.6,
      minWidth: 100,
      valueFormatter: (pa) => formatDate(pa.value),
    },
    {
      field: "  ",
      headerName: "Actions",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params) => {
        return <AdminActions data={params.row} key={params.id} />;
      },
    },
  ];

  const { filterData: rows, searchProps } = useSearchBar<ManageTeamDataTypes>(
    data?.admins || []
  );

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Manage Team
          </h2>
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
            <div>
              <Button
                color="primary"
                onPress={() => isMemberOnOpen()}
                endContent={<AiOutlinePlus />}
                className="min-w-[40px]"
              >
                <span className="hidden sm:block">Add new member</span>
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

        {/* add new member modal */}
        <Modal
          placement="center"
          isOpen={isMemberOpen}
          onOpenChange={isMemberOnOpenChange}
        >
          <AddNewAdminModal />
        </Modal>

        {/* table view modal */}
      </div>
    </AdminLayout>
  );
};

export default ManageTeam;
