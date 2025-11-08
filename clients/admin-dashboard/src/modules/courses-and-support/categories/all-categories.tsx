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
  Modal,
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useQuery } from "@apollo/client";
import { CATEGORIES_QUERY } from "@/graphql/queries";
import { AiOutlinePlus } from "react-icons/ai";
import CategoryModal from "./CategoryModal";
import CategoryActions from "./CategoryActions";
// custop files import

const AllCategories = () => {
  const { data } = useQuery(CATEGORIES_QUERY);

  const columns: GridColDef<CategoryDataType>[] = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "name",
      headerName: "Category",
      flex: 0.6,
      minWidth: 100,
    },
    {
      field: "subcategories",
      headerName: "Sub Categories",
      flex: 0.7,
      minWidth: 150,
      renderCell: ({ row }) => (
        <div className="line-clamp-1">
          {row.subcategories.map((v) => v.name).join(",")}
        </div>
      ),
    },
    {
      field: "topics",
      headerName: "Topics",
      flex: 0.5,
      minWidth: 100,
      renderCell: ({ row }) => (
        <div className="line-clamp-1">
          {row.subcategories
            .flatMap((v) => v.topics)
            .map((v) => v.name)
            .join(",")}
        </div>
      ),
    },
    {
      field: "sold_out",
      headerName: "Sold Out",
      flex: 0.4,
      minWidth: 80,

      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.sold_out}</div>
          </>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Last Changed",
      flex: 0.6,
      minWidth: 100,
      valueFormatter: (pa) => formatDate(pa.value),
    },
    {
      field: "  ",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 80,
      renderCell: ({ row }) => <CategoryActions data={row} />,
    },
  ];

  const { filterData: rows, searchProps } = useSearchBar<CategoryDataType>(
    data?.categories || []
  );

  const { isOpen: createModal, onOpenChange: createModalChange } =
    useDisclosure();

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Categories
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
            {/* add button here */}
            <div>
              <Button
                color="primary"
                onPress={createModalChange}
                endContent={<AiOutlinePlus />}
              >
                Create Category
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
        <Modal
          placement="center"
          scrollBehavior="outside"
          size="2xl"
          isOpen={createModal}
          onOpenChange={createModalChange}
        >
          <CategoryModal type="create" />
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AllCategories;
