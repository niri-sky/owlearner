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
import useUploadFiles from "@/shared/hooks/use-upload-files";
import { useMutation } from "@apollo/client";
import { SINGLE_COURSES_QUERY, UPDATE_COURSE } from "@/graphql/queries";
import { useParams } from "next/navigation";
import VideoUploadModal from "../create-course/VideoUploadModal";

const addSectionSchema = yup.object({
  section_name: yup.string().required(),
  content: yup
    .array(
      yup.object({
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
      })
    )
    .min(1),
});

type SectionFormType = yup.InferType<typeof addSectionSchema>;

type Props = {
  courseId: number;
};

function AddNewSectionModal({ courseId }: Props) {
  const { filesUploader, showUploadingFiles, uploadFiles, updateUploadFiles } =
    useUploadFiles();

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

  const methods = useForm({
    resolver: yupResolver(addSectionSchema),
    defaultValues: {
      content: [{ file: "", video_description: "", video_title: "" }],
    },
  });

  const {
    isOpen: uploadModal,
    onOpenChange: uploadModalChange,
    onClose,
  } = useDisclosure();

  const onSubmit = async (data: SectionFormType) => {
    await showUploadingFiles(data);
    uploadModalChange();
    let d = await filesUploader(data);
    const newD = normalizeData(d);

    await updateCourse({
      variables: {
        id: courseId,
        input: {
          section: {
            create: newD,
          },
        },
      },
    });
  };

  return (
    <ModalContent>
      {(onClose) => (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((e) => onSubmit(e).then(onClose))}
          >
            <ModalHeader>Add New Section</ModalHeader>
            <ModalBody>
              <InputField
                label="Section name"
                placeholder="Enter section name"
                {...methods.register("section_name")}
                errors={methods.formState.errors}
              />
              <ContentInfoForm
                control={methods.control}
                name={`content`}
                register={methods.register}
              />
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

export default AddNewSectionModal;

const normalizeData = (s: any) => ({
  ...s,
  content: {
    create: s.content.map(({ assignment, ...c }: any) =>
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
      )
    ),
  },
});
