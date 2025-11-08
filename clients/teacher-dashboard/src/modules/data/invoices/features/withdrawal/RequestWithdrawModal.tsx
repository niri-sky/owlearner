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
import {
  TICKETS_QUERY,
  CREATE_TICKET,
  TEACHER_WITHDRAW_REQUEST,
  PAYMENT_INVOICES_QUERY,
} from "@/graphql/queries";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import useUserData from "@/shared/hooks/useUserData";
import InputField from "@/modules/courses-and-support/create-course/field/InputField";
import TextField from "@/modules/courses-and-support/create-course/field/TextField";

const createTicketSchema = yup.object({
  amount: yup.number().required(),
  bankDetails: yup.string().required(),
});

type FormType = yup.InferType<typeof createTicketSchema>;

function RequestWithdrawModal() {
  const { userData } = useUserData();
  const [requestWithdraw, { loading }] = useMutation(TEACHER_WITHDRAW_REQUEST, {
    refetchQueries: [
      {
        query: PAYMENT_INVOICES_QUERY,
        variables: { where: { teacherId: { equals: Number(userData?.id) } } },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Withdraw requested");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(createTicketSchema),
  });

  const variables = (d: FormType) => ({
    input: {
      id: Number(userData?.id),
      ...d,
    },
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            requestWithdraw({ variables: variables(d) }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            Request Withdraw
          </ModalHeader>
          <ModalBody>
            <div>
              <InputField
                label="Amount"
                {...register("amount")}
                type="number"
                errors={errors}
                placeholder="enter withdraw amount"
              />
              <div className="pt-4"></div>
              <TextField
                name="bankDetails"
                control={control}
                label="Bank Details"
                errors={errors}
              />
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
              {!loading && "Request"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default RequestWithdrawModal;
