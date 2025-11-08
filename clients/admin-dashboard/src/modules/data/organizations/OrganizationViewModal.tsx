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
import { ORGANIZATIONS_QUERY, UPDATE_ORGANIZATION } from "@/graphql/queries";

import toast from "react-hot-toast";
import useUserData from "@/shared/hooks/useUserData";

type Props = {
  data: OrganizationTypes;
};

function OrganizationViewModal({ data }: Props) {
  const [updateOrganization, { loading }] = useMutation(UPDATE_ORGANIZATION, {
    refetchQueries: [ORGANIZATIONS_QUERY],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Organization updated");
    },
    onError: (error, clientOptions) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  const { isAdmin } = useUserData();

  return (
    <ModalContent>
      {(onClose) => (
        <form>
          <ModalBody>
            <div className="flex w-full flex-col justify-center pt-8 items-center text-center gap-3">
              <div className="rounded-full w-[100px] h-[100px] overflow-hidden mx-auto">
                <Image
                  className="rounded-full object-cover"
                  width={100}
                  height={100}
                  src={data?.profile || "/user-1.jpg"}
                  alt="contact employee image"
                />
              </div>
              <div className="w-full">
                <h2 className="text-[22px] font-semibold text-txt">
                  {data.name}
                </h2>
              </div>
              <div className="w-full">
                <p className="text-[16] text-txt">{data.email}</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center w-full !pb-8">
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            {isAdmin && data?.status !== "active" && (
              <Button
                color="primary"
                type="submit"
                disabled={loading}
                isIconOnly={loading}
                className="min-w-[100px] disabled:opacity-75"
                startContent={loading && <Spinner size="sm" color="default" />}
                onClick={() => {
                  updateOrganization({
                    variables: {
                      id: Number(data.id),
                      input: {
                        status: "active",
                        organizationEarning: {
                          create: {
                            earn: 0,
                            withdraw: 0,
                          },
                        },
                      },
                    },
                  }).then(onClose);
                }}
              >
                {!loading && "Approved"}
              </Button>
            )}
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default OrganizationViewModal;
