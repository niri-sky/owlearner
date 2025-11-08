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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
// custop files import
import { organizations } from "./data";
import { AiOutlinePlus } from "react-icons/ai";

const Active = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
    {
      field: "courses",
      headerName: "Courses",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[60%] mx-auto">{params.row.courses}</div>
          </>
        );
      },
    },
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
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="new">View</DropdownItem>
                <DropdownItem key="delete" color="danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const rows: OrganizationTypes[] = [];

  organizations &&
    organizations.forEach((organization: OrganizationTypes) => {
      rows.push({
        id: organization?.id,
        email: organization?.email,
        avatar: organization?.avatar,
        teachers: organization?.teachers,
        courses: organization?.courses,
        total: organization?.total,
        join: organization?.join,
        name: organization?.name,
      });
    });
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-between items-center gap-5">
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
                Create Organization
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col gap-3">
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="">Organization Name</label>
                    <input
                      placeholder="Organization Name"
                      className="py-3 px-2 border
                     border-bcolor
                     outline-none rounded-md"
                      type="text"
                      name=""
                      id=""
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="">Teacher Name</label>
                    <input
                      placeholder="Teacher Name"
                      className="py-3 px-2 border
                     border-bcolor
                     outline-none rounded-md"
                      type="text"
                      name=""
                      id=""
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="">Course Name</label>
                    <input
                      placeholder="Course Name"
                      className="py-3 px-2 border
                     border-bcolor
                     outline-none rounded-md"
                      type="text"
                      name=""
                      id=""
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="">Total Amount</label>
                    <input
                      placeholder="Total Amount"
                      className="py-3 px-2 border
                     border-bcolor
                     outline-none rounded-md"
                      type="text"
                      name=""
                      id=""
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Active;
