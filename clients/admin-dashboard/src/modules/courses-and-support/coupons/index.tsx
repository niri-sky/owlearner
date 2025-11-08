"use client";
// global package
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AiOutlinePlus } from "react-icons/ai";
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
} from "@nextui-org/react";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { COUPONS_QUERY, CREATE_COUPON } from "@/graphql/queries";
import useUserData from "@/shared/hooks/useUserData";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CreateCouponModal from "./CreateCouponModal";
import CouponActions from "./CouponActions";
// custop files import

export type CouponDataTypes = {
  id: string | number;
  name: string;
  course: {
    id: string;
    title: string;
  };
  couponUser: any[];
  code: string;

  createdAt: string | Date;
  discount: number;
  type: string;
};

function Coupons() {
  const { userData } = useUserData();

  const { data } = useQuery(COUPONS_QUERY);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const columns: GridColDef<CouponDataTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },

    {
      field: "name",
      headerName: "Coupon Name",
      flex: 0.7,
      minWidth: 120,
      renderCell: (params) => {
        return <div className="">{params.row?.name}</div>;
      },
    },
    {
      field: "code",
      headerName: "Coupon Code",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => {
        return <div className="">{params.row.code}</div>;
      },
    },
    {
      field: "discount",
      headerName: "Discount",
      flex: 0.6,
      minWidth: 100,
      renderCell: ({ row }) => {
        return (
          <div className="">
            {row.type == "amount" && "$"}
            {row.discount}
            {row.type == "percent" && "%"}
          </div>
        );
      },
    },
    {
      field: "used",
      headerName: "Coupon Used",
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => {
        return <div className="">{params.row?.couponUser?.length || 0}</div>;
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
      renderCell: (params) => (
        <CouponActions courseData={[]} data={params.row} />
      ),
    },
  ];

  const { filterData: rows, searchProps } = useSearchBar<CouponDataTypes>(
    data?.coupons || []
  );

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Coupons</h2>
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
                onPress={onOpenChange}
                endContent={<AiOutlinePlus />}
                className="min-w-[40px]"
              >
                <span className="hidden sm:block">Create Coupon</span>
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
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <CreateCouponModal courseData={[]} />
      </Modal>
    </>
  );
}

export default Coupons;
