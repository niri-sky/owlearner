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
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import { INVITE_ORGANIZATION, ORGANIZATIONS_QUERY } from "@/graphql/queries";
import toast from "react-hot-toast";

const inviteOrganizationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required(),
});

function OrganizationInviteModal() {
  const [inviteOrganization, { loading }] = useMutation(INVITE_ORGANIZATION, {
    refetchQueries: [ORGANIZATIONS_QUERY],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Invite successfull");
    },
    onError: (err) => {
      console.log("Error occured", err);
      toast.error("Something went wrong!");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inviteOrganizationSchema),
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            inviteOrganization({ variables: { input: d } }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            Create Organization
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="">Organization name</label>
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
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

export default OrganizationInviteModal;
