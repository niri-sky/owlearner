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

import { useMutation } from "@apollo/client";
import {
  ADMINS_QUERY,
  DELETE_ADMIN,
  INVITE_ADMIN,
  PAYMENT_INVOICES_QUERY,
  UPDATE_ADMIN,
  UPDATE_PAYMENT_INVOICE,
} from "@/graphql/queries";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import toast from "react-hot-toast";
import useUserData from "@/shared/hooks/useUserData";

type Props = {
  data: PaymentInvoiceType;
};

const roleSchema = yup.object({
  status: yup.string().required(),
});

function ViewPaymentInvoiceModal({ data }: Props) {
  const { userData } = useUserData();

  const [updatePaymentInvoice, { loading }] = useMutation(
    UPDATE_PAYMENT_INVOICE,
    {
      refetchQueries: [
        {
          query: PAYMENT_INVOICES_QUERY,
          variables: {
            where: {
              to: {
                equals: "admin",
              },
            },
          },
        },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success("Invoice updated");
      },
      onError: (error, clientOptions) => {
        toast.error(error.message);
      },
    }
  );

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(roleSchema),
    defaultValues: { status: data.status },
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            updatePaymentInvoice({
              variables: { id: Number(data.id), input: d },
            }).then(onClose)
          )}
        >
          <ModalBody>
            <div className="flex w-full flex-col justify-center pt-8 items-center text-center gap-3">
              <div className="rounded-full w-[100px] h-[100px] overflow-hidden mx-auto">
                <Image
                  className="rounded-full object-cover"
                  width={100}
                  height={100}
                  src={data?.teacher?.profile || "/user-1.jpg"}
                  alt="contact employee image"
                />
              </div>
              <div className="w-full">
                <h2 className="text-[22px] font-semibold text-txt">
                  {data?.teacher?.name}
                </h2>
              </div>
              <div className="w-full">
                <p className="text-[16] text-txt">{data?.teacher?.email}</p>
              </div>
              <div className="w-1/2 mx-auto pt-2">
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <Select
                      placeholder="Select role"
                      className="w-full"
                      onChange={onChange}
                      onBlur={onBlur}
                      selectedKeys={value ? [value] : []}
                      items={[
                        { label: "Pending", value: "pending" },
                        { label: "Declined", value: "declined" },
                        { label: "Inprogress", value: "inprogress" },
                        { label: "Paid", value: "paid" },
                      ]}
                      classNames={{
                        trigger: errors.status && "border !border-red-500",
                      }}
                    >
                      {(val) => (
                        <SelectItem key={val.value} value={val.value}>
                          {val.label}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                />
                {errors.status && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.status?.message?.toString()}
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center w-full !pb-8">
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>

            <Button
              color="primary"
              type="submit"
              disabled={!isDirty || loading}
              isIconOnly={loading}
              className="min-w-[100px] disabled:opacity-75"
              startContent={loading && <Spinner size="sm" color="default" />}
            >
              {!loading && "Update"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default ViewPaymentInvoiceModal;
