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
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";
import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { TEACHER_COURSES_QUERY } from "@/graphql/queries";
import useUserData from "@/shared/hooks/useUserData";
// custop files import

export const fakeCoursesData = [...Array(20)].map((_, i) => ({
  id: i + 1,
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  teacher: faker.person.fullName(),
  course_title: faker.commerce.productName(),
  type: faker.helpers.arrayElement(["teacher", "student"]),
  created_at: faker.date.past(),
  sold_out: faker.number.int(50),
  course_price: faker.number.int(200),
  status: faker.helpers.arrayElement(["live", "draft", "pending", "declined"]),
}));

const AllCourses = () => {
  const { userData } = useUserData();

  const { data } = useQuery(TEACHER_COURSES_QUERY, {
    variables: {
      input: {
        teacherId: {
          equals: Number(userData?.id),
        },
      },
    },
    skip: !userData?.id,
  });

  console.log("Teachar course data", data);

  const router = useRouter();

  const columns: GridColDef<CourseDataTypes>[] = [
    { field: "id", headerName: "#", flex: 0.1 },

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
      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">{params.row.price}</div>
          </>
        );
      },
    },
    {
      field: "invoices",
      headerName: "Sale",
      flex: 0.4,
      minWidth: 80,

      renderCell: (params: any) => {
        return (
          <>
            <div className="w-[50%] mx-auto">
              {params?.row?.invoices?.length || 0}
            </div>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      minWidth: 80,

      renderCell: (params: any) => {
        return (
          <>
            <div className=" capitalize">{params.row.status}</div>
          </>
        );
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
      renderCell: (params) => {
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
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  onClick={() => {
                    router.push("/edit-course/" + params?.row?.slug);
                  }}
                  key="new"
                >
                  Preview & Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const { filterData: rows, searchProps } = useSearchBar<CourseDataTypes>(
    data?.courses || []
  );

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Courses</h2>
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
    </AdminLayout>
  );
};

export default AllCourses;
