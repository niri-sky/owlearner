import {
  ADMINS_QUERY,
  COURSES_QUERY,
  DELETE_ADMIN,
  DELETE_ORGANIZATION,
  DELETE_TEACHER,
  ORGANIZATIONS_QUERY,
  SINGLE_COURSES_QUERY,
  TEACHERS_QUERY,
  UPDATE_COURSE,
} from "@/graphql/queries";
import useCreateNotification from "@/shared/hooks/use-create-notification";
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
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  data: CourseDataTypes;
};

function CourseDeclineModal({ data }: Props) {
  const { userData } = useUserData();

  const params = useParams();

  const { createNotification } = useCreateNotification();

  const [updateCourse, { loading }] = useMutation(UPDATE_COURSE, {
    refetchQueries: [
      { query: COURSES_QUERY },
      params?.slug && {
        query: SINGLE_COURSES_QUERY,
        variables: {
          slug: params?.slug,
        },
      },
    ],
    awaitRefetchQueries: true,

    onCompleted: (d) => {
      const courseData = d.updateCourse;
      createNotification({
        link: "/courses",
        text: "declined your course",
        receiver: {
          type: "teacher",
          id: courseData.teacher.id,
        },
        sender: {
          type: "admin",
          id: userData?.id,
        },
      });
      toast.success("Course updated");
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
            Declined Course
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to declined this course? This action cannot
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
                updateCourse({
                  variables: {
                    id: Number(data?.id),
                    input: { status: "declined" },
                  },
                }).then(() => {
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

export default CourseDeclineModal;
