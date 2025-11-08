import {
  DELETE_TICKET,
  SINGLE_TEACHER_QUERY,
  TICKETS_QUERY,
  UNFOLLOW_USER,
  UPDATE_TICKET,
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
  data: FollowersType;
};

function UnfollowModal({ data }: Props) {
  const { userData } = useUserData();

  const [deleteFollow, { loading }] = useMutation(UNFOLLOW_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: SINGLE_TEACHER_QUERY,
        variables: {
          id: Number(userData?.id),
        },
      },
    ],
  });

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Unfollow user
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to unfollow this user? This action cannot be
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
                deleteFollow({
                  variables: {
                    id: Number(data.id),
                  },
                }).then(onClose);
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

export default UnfollowModal;
