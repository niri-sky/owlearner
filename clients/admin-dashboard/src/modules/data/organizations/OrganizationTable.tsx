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
} from "@nextui-org/react";
// custop files import
import { AiOutlinePlus } from "react-icons/ai";

import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useMemo } from "react";
import OrganizationActions from "./OrganizationActions";
import OrganizationInviteModal from "./OrganizationInviteModal";
// custop files import

type Props = {
  data: OrganizationTypes[];
  type: "active" | "pending";
};

const OrganizationTable = ({ data, type }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const columns: GridColDef<OrganizationTypes>[] = [
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
      field: "teachers",
      headerName: "Teachers",
      flex: 0.3,
      minWidth: 80,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{row.teachers?.length || 0}</div>
          </>
        );
      },
    },
    {
      field: "courses",
      headerName: "Courses",
      minWidth: 80,
      flex: 0.3,
      renderCell: ({ row }) => <ShowCourses row={row} />,
    },
    {
      field: "total",
      headerName: "Total Sales",
      flex: 0.3,
      minWidth: 80,
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{0}</div>
          </>
        );
      },
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      flex: 0.4,
      valueFormatter: (pa) => formatDate(pa.value),
      minWidth: 100,
    },
    {
      field: "  ",
      headerName: "Actions",
      flex: 0.2,
      minWidth: 80,
      renderCell: ({ row }) => <OrganizationActions data={row} />,
    },
  ];

  const { filterData: rows, searchProps } = useSearchBar(data);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-between items-center gap-5">
        <div className="mb-[8px]">
          <SearchBar {...searchProps} />
        </div>
        <div>
          <Button
            color="primary"
            onPress={onOpen}
            endContent={<AiOutlinePlus />}
          >
            Create Organization
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
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <OrganizationInviteModal />
      </Modal>
    </div>
  );
};

function ShowCourses({ row }: { row: OrganizationTypes }) {
  const courses = useMemo(() => {
    let courseLength = row.teachers.reduce((a, c) => a + c.courses.length, 0);
    return courseLength;
  }, [row]);
  return (
    <>
      <div className="w-[60%] mx-auto">{courses}</div>
    </>
  );
}

export default OrganizationTable;
