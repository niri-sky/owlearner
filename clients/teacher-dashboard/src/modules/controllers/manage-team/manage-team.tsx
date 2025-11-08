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
} from "@nextui-org/react";
// custop files import
import { manageTeamData } from "./elements/data";
import AdminLayout from "@/shared/components/admin-layout";
import { AiOutlinePlus } from "react-icons/ai";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";

export const fakeManageTeam = [...Array(20)].map((_, i) => ({
  id: i + 1,
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  name: faker.person.fullName(),
  role: faker.helpers.arrayElement(["editor", "analyser"]),
  joined_at: faker.date.past(),
}));

const ManageTeam = () => {
  const {
    isOpen: isMemberOpen,
    onOpen: isMemberOnOpen,
    onOpenChange: isMemberOnOpenChange,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: isViewOnOpen,
    onOpenChange: isViewOnOpenChange,
  } = useDisclosure();

  const columns: GridColDef<ManageTeamDataTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },
    {
      field: "avatar",
      headerName: "Name",
      flex: 0.6,
      minWidth: 220,
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
      field: "joined_at",
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
                <DropdownItem onPress={() => isViewOnOpen()} key="new">
                  View
                </DropdownItem>
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

  const { filterData: rows, searchProps } =
    useSearchBar<ManageTeamDataTypes>(fakeManageTeam);

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
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
                  Add new member
                </ModalHeader>
                <ModalBody>
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="">Member name</label>
                      <input
                        placeholder="Name"
                        className="py-3 px-2 border
                     border-bcolor
                     outline-none rounded-md"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="">Email</label>
                      <input
                        placeholder="abc@gmail.com"
                        className="py-3 px-2 border
                     border-bcolor
                     outline-none rounded-md"
                        type="text"
                        name=""
                        id=""
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="">Role</label>
                      <div className="pt-2"></div>
                      <Select placeholder="Select role" className="w-full">
                        <SelectItem key="editor">Editor</SelectItem>
                        <SelectItem key="analyser">Analyser</SelectItem>
                      </Select>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Add
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* table view modal */}
        <Modal
          placement="center"
          isOpen={isViewOpen}
          onOpenChange={isViewOnOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="flex w-full flex-col justify-center pt-8 items-center text-center gap-3">
                    <div className="rounded-full w-[100px] h-[100px] overflow-hidden mx-auto">
                      <Image
                        className="rounded-full object-cover"
                        width={100}
                        height={100}
                        src={"https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                        alt="contact employee image"
                      />
                    </div>
                    <div className="w-full">
                      <h2 className="text-[22px] font-semibold text-txt">
                        Hasanul Haque Banna
                      </h2>
                    </div>
                    <div className="w-full">
                      <p className="text-[16] text-txt">example@gmail.com</p>
                    </div>
                    <div className="w-1/2 mx-auto pt-2">
                      <Select placeholder="Select an item" className="max-w-xs">
                        <SelectItem key="editor">Editor</SelectItem>
                        <SelectItem key="analyser">Analyser</SelectItem>
                      </Select>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-center items-center w-full !pb-8">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Update
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ManageTeam;
