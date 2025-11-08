import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Modal,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { INVTIE_TEACHER } from "@/graphql/queries";
import useUserData from "@/shared/hooks/useUserData";
import InputField from "@/shared/field/InputField";

const formSchema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required(),
});

type FormType = yup.InferType<typeof formSchema>;

function InviteTeacherModal() {
  const { userData } = useUserData();

  const [inviteTeacher, { loading }] = useMutation(INVTIE_TEACHER, {
    onCompleted: () => {
      toast.success("Teacher invited");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>();

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            inviteTeacher({
              variables: { input: { ...d, link: userData?.id } },
            }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            Invite Teacher
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-4">
              <InputField
                label="Name"
                errors={errors}
                {...register("name")}
                placeholder="enter name"
              />
              <InputField
                label="Email"
                type="email"
                errors={errors}
                placeholder="enter email"
                {...register("email")}
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
              {!loading && "Invite"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default InviteTeacherModal;
