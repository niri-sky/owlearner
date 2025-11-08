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
  cn,
  Spinner,
} from "@nextui-org/react";
// custop files import
import AdminLayout from "@/shared/components/admin-layout";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { useMutation, useQuery } from "@apollo/client";
import { TICKETS_QUERY, CREATE_TICKET } from "@/graphql/queries";
import TicketActions from "./TicketActions";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import useUserData from "@/shared/hooks/useUserData";

const createTicketSchema = yup.object({
  title: yup.string().required(),
  message: yup.string().required(),
});

type FormType = {
  title: string;
  message: string;
};

function CreateTicketModal() {
  const { userData } = useUserData();
  const [createTicket, { loading }] = useMutation(CREATE_TICKET, {
    refetchQueries: [
      {
        query: TICKETS_QUERY,
        variables: { input: { teacherId: { equals: Number(userData?.id) } } },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Ticket created");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(createTicketSchema),
  });

  const variables = (d: FormType) => ({
    input: {
      title: d.title,
      status: "pending",

      messages: {
        create: {
          message: d.message,
          teacher: {
            connect: {
              id: Number(userData?.id),
            },
          },
        },
      },

      type: "teacher",
      teacher: {
        connect: { id: Number(userData?.id) },
      },
    },
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            createTicket({ variables: variables(d) }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            Create Ticket
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="">Ticket Title</label>
              <input
                placeholder="enter ticket title"
                className={cn(
                  "py-3 px-2 border border-bcolor outline-none rounded-md",
                  errors.title && "!border-red-500"
                )}
                type="text"
                {...register("title")}
              />
              {errors.title && (
                <div className="text-sm text-red-500">
                  {errors.title.message?.toString()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="">Message</label>
              <textarea
                placeholder="write message here.."
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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>

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
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default CreateTicketModal;
