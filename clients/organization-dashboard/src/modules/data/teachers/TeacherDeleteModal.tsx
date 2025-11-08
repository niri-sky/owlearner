import {
  ADMINS_QUERY,
  DELETE_ADMIN,
  DELETE_TEACHER,
  TEACHERS_QUERY,
} from "@/graphql/queries";
import useUserData from "@/shared/hooks/useUserData";
import { useMutation } from "@apollo/client";
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
import toast from "react-hot-toast";

type Props = {
  data: TeacherTypes;
};

function TeacherDeleteModal({ data }: Props) {
  const { userData } = useUserData();

  const [deleteAdmin, { loading }] = useMutation(DELETE_TEACHER, {
    refetchQueries: [
      {
        query: TEACHERS_QUERY,
        variables: {
          where: {
            organizationId: { equals: Number(userData?.id) },
          },
        },
      },
    ],
    awaitRefetchQueries: true,

    onCompleted: () => {
      toast.success("Teacher deleted");
    },
    onError: (error, clientOptions) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Delete Teacher
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this teacher? This action cannot
              be undone
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              No
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              isIconOnly={loading}
              className="min-w-[80px]"
              startContent={loading && <Spinner size="sm" color="default" />}
              onPress={() => {
                deleteAdmin({ variables: { id: Number(data?.id) } }).then(
                  () => {
                    onClose();
                  }
                );
              }}
            >
              {!loading && "Yes"}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}

export default TeacherDeleteModal;
