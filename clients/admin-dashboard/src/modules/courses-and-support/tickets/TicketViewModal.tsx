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
  cn,
  Spinner,
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";

import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useMutation, useQuery } from "@apollo/client";
import { TICKETS_QUERY, UPDATE_TICKET } from "@/graphql/queries";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useUserData from "@/shared/hooks/useUserData";
import useNotifications from "@/shared/hooks/use-notifications";
import useCreateNotification from "@/shared/hooks/use-create-notification";

type Props = {
  data: TicketData;
};

const answerSchema = yup.object({
  message: yup.string().required(),
});

function TicketViewModal({ data }: Props) {
  const { isAdmin, userData } = useUserData();

  const { createNotification } = useCreateNotification();

  const [updateTicket, { loading }] = useMutation(UPDATE_TICKET, {
    refetchQueries: [{ query: TICKETS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Answered");
      createNotification({
        link: "/tickets",
        text: "answered your ticket",
        receiver: {
          type: data.type,
          id: data?.[data?.type]?.id,
        },
        sender: {
          type: "admin",
          id: userData?.id,
        },
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!");
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(answerSchema),
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            updateTicket({
              variables: {
                id: Number(data.id),
                input: {
                  status: "answered",
                  messages: {
                    create: {
                      message: d.message,
                      admin: { connect: { id: Number(userData?.id) } },
                    },
                  },
                },
              },
            }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[20px] font-semibold text-txt capitalize gap-1">
            {data.title}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              {data.messages.map((v, i) => (
                <div
                  key={"gshd" + i}
                  className={cn(
                    "flex gap-[5px]",
                    v.admin && "flex-row-reverse justify-start"
                  )}
                >
                  <div>
                    <Image
                      src={
                        (v.admin || v.teacher || v.organization || v.student)
                          ?.profile || "/user-1.jpg"
                      }
                      width={30}
                      height={30}
                      alt=""
                    />
                  </div>
                  <div className="bg-bcolor max-w-[calc(100%-35px)] p-1 text-sm">
                    {v.message}
                  </div>
                </div>
              ))}
            </div>
            {isAdmin && data.status != "solved" && (
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="">Add Answer</label>
                <textarea
                  placeholder="write answer here.."
                  className={cn(
                    "py-3 px-2 border border-bcolor outline-none rounded-md",
                    errors.message && "!border-red-500"
                  )}
                  {...register("message")}
                ></textarea>
                {errors.message && (
                  <div className="text-sm text-red-500">
                    {errors.message.message?.toString()}
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            {isAdmin && data.status != "solved" && (
              <Button
                color="primary"
                type="submit"
                disabled={loading}
                isIconOnly={loading}
                className="min-w-[80px]"
                startContent={loading && <Spinner size="sm" color="default" />}
              >
                {!loading && "Add"}
              </Button>
            )}
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default TicketViewModal;
