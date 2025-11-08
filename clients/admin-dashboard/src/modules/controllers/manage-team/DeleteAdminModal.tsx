import { ADMINS_QUERY, DELETE_ADMIN } from "@/graphql/queries";
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
  data: ManageTeamDataTypes;
};

function DeleteAdminModal({ data }: Props) {
  const [deleteAdmin, { loading }] = useMutation(DELETE_ADMIN, {
    refetchQueries: [ADMINS_QUERY],
    awaitRefetchQueries: true,

    onCompleted: () => {
      toast.success("Admin deleted");
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
            Delete Admin
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete admin? This action cannot be
              undone
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

export default DeleteAdminModal;
