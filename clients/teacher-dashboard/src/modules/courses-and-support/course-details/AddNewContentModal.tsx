import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import ContentInfoForm from "../create-course/form/ContentInfoForm";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../create-course/field/InputField";
import SingleContentForm, {
  AssignmentComponent,
  LinkComponent,
  QuizComponent,
} from "../create-course/form/SingleContentForm";
import TextField from "../create-course/field/TextField";
import FileField from "../create-course/field/FileField";
import { MdAssignmentAdd } from "react-icons/md";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { SINGLE_COURSES_QUERY, UPDATE_COURSE } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
import useUploadFiles from "@/shared/hooks/use-upload-files";
import VideoUploadModal from "../create-course/VideoUploadModal";

const addContentSchema = yup.object({
  video_title: yup.string().required(),
  video_description: yup.string().required(),
  file: yup.mixed().required(),
  links: yup.array(
    yup.object({
      title: yup.string().required(),
      link: yup.string().required(),
    })
  ),
  quizzes: yup.array(
    yup.object({
      title: yup.string().required(),
      answer: yup.string().required(),
      options: yup.array(yup.string().required()),
    })
  ),
});

type ContentFormType = yup.InferType<typeof addContentSchema>;

type Props = {
  courseId: number;
  sectionId: number;
};

function AddNewContentModal({ courseId, sectionId }: Props) {
  const { filesUploader, showUploadingFiles, uploadFiles, updateUploadFiles } =
    useUploadFiles();

  const methods = useForm<ContentFormType>({
    resolver: yupResolver(addContentSchema),
  });

  const {
    register,
    formState: { errors },
    control,
  } = methods;

  const params = useParams();

  const [updateCourse, { loading }] = useMutation(UPDATE_COURSE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: SINGLE_COURSES_QUERY,
        variables: {
          slug: params.slug,
        },
      },
    ],
  });

  const {
    isOpen: uploadModal,
    onOpenChange: uploadModalChange,
    onClose,
  } = useDisclosure();

  const onSubmit = async (data: ContentFormType) => {
    await showUploadingFiles(data);
    uploadModalChange();
    let d = await filesUploader(data);
    const newD = normalizeData(d);

    await updateCourse({
      variables: {
        id: courseId,
        input: {
          section: {
            update: {
              where: {
                id: sectionId,
              },
              data: {
                content: {
                  create: newD,
                },
              },
            },
          },
        },
      },
    });
  };

  const [assignmentWrap, setAssignmentWrap] = useState(false);

  return (
    <ModalContent>
      {(onClose) => (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((e) => onSubmit(e).then(onClose))}
          >
            <ModalHeader>Add New Content</ModalHeader>
            <ModalBody>
              <div className="w-full">
                <div className="pt-2"></div>
                <InputField
                  errors={errors}
                  {...register(`video_title`)}
                  label="Video Title"
                  placeholder="Enter video title"
                />
              </div>

              <div className="w-full">
                <TextField
                  label="Video Description"
                  name={`video_description`}
                  control={control}
                  errors={errors}
                />
              </div>
              <div className="w-full">
                <FileField
                  label="Video File"
                  name={`file`}
                  accept="video/mp4,video/x-m4v,video/*"
                  control={control}
                  errors={errors}
                />
              </div>

              <LinkComponent
                name={`links`}
                control={control as any}
                register={register}
              />

              <QuizComponent name={`quizzes`} />
              {/* <div>
                <Button
                  onClick={() => {
                    setAssignmentWrap(!assignmentWrap);
                  }}
                  startContent={<MdAssignmentAdd />}
                >
                  Assignment
                </Button>
              </div>

              <motion.div
                className="overflow-hidden flex flex-col  gap-4"
                initial={{ height: 0 }}
                animate={{ height: assignmentWrap ? "auto" : 0 }}
              >
                <AssignmentComponent name={`assignment`} />
              </motion.div> */}
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
                {!loading && "Create"}
              </Button>
            </ModalFooter>
          </form>
          <Modal isOpen={uploadModal} onOpenChange={uploadModalChange}>
            <VideoUploadModal uploadFiles={uploadFiles} />
          </Modal>
        </FormProvider>
      )}
    </ModalContent>
  );
}

const normalizeData = ({ assignment, ...c }: any) =>
  Object.assign(
    {
      ...c,
      quizzes: { create: c.quizzes },
      links: { create: c.links },
    },
    c.resources && {
      resources: {
        create: c.resources,
      },
    },
    assignment?.name && {
      assignment: {
        create: { ...assignment, mark: Number(assignment.mark) },
      },
    }
  );

export default AddNewContentModal;
