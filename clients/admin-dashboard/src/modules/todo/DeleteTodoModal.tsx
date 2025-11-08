import {
  ADMINS_QUERY,
  DELETE_ADMIN,
  DELETE_TICKET,
  DELETE_TODO,
  TICKETS_QUERY,
  TODOS_QUERY,
} from "@/graphql/queries";
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
  id: number;
  adminId: number;
  onDeleted: () => any;
};

function DeleteTodoModal({ id, adminId, onDeleted }: Props) {
  const [deleteTodo, { loading }] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: TODOS_QUERY, variables: { adminId } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Todo deleted");
      onDeleted?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Delete Todo</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this todo? This action cannot be
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
                deleteTodo({ variables: { id: Number(id) } }).then(() => {
                  onClose();
                });
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

export default DeleteTodoModal;
