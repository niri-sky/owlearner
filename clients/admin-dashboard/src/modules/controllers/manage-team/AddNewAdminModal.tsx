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

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ADMINS_QUERY, DELETE_ADMIN, INVITE_ADMIN } from "@/graphql/queries";

import { useMutation, useQuery } from "@apollo/client";
import * as yup from "yup";
import { useState } from "react";
import toast from "react-hot-toast";

const newAdminSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  role: yup.string().required("Role is required"),
});

type NewAdminType = {
  name: string;
  email: string;
  role: string;
};

function AddNewAdminModal() {
  const [inviteAdmin, { data, error, loading }] = useMutation(INVITE_ADMIN, {
    refetchQueries: [{ query: ADMINS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Invitation sent");
    },
    onError: (error) => {
      toast.error("Something went wrong!");
    },
  });

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<NewAdminType>({
    resolver: yupResolver(newAdminSchema),
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            inviteAdmin({ variables: { input: d } }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            Add new member
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="">Member name</label>
                <input
                  placeholder="Name"
                  className={cn(
                    "py-3 px-2 border border-bcolor outline-none rounded-md",
                    errors.name && "!border-red-500"
                  )}
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <div className="text-sm text-red-500">
                    {errors.name.message?.toString()}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="">Email</label>
                <input
                  placeholder="example@mail.com"
                  className={cn(
                    "py-3 px-2 border border-bcolor outline-none rounded-md",
                    errors.email && "!border-red-500"
                  )}
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="text-sm text-red-500">
                    {errors.email.message?.toString()}
                  </div>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="">Role</label>
                <div className="pt-2"></div>
                <Controller
                  name="role"
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
                        { label: "Admin", value: "admin" },
                        { label: "Moderator", value: "moderator" },
                      ]}
                      classNames={{
                        trigger: errors.role && "border !border-red-500",
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
                {errors.role && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.role?.message?.toString()}
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              type="button"
              onPress={onClose}
            >
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

export default AddNewAdminModal;
