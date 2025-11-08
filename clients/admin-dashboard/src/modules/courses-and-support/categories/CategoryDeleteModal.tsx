import {
  ADMINS_QUERY,
  CATEGORIES_QUERY,
  DELETE_ADMIN,
  DELETE_CATEGORY,
  DELETE_ORGANIZATION,
  DELETE_TEACHER,
  ORGANIZATIONS_QUERY,
  TEACHERS_QUERY,
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
  data: CategoryDataType;
};

function CategoryDeleteModal({ data }: Props) {
  const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [CATEGORIES_QUERY],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Category deleted");
    },
    onError: (error, clientOptions) => {
      toast.error("Something went wrong");
    },
  });

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Delete Category
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this category? This action cannot
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
                deleteCategory({ variables: { id: Number(data?.id) } }).then(
                  onClose
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

export default CategoryDeleteModal;
