"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RightFormStatus, { FormStatusType } from "./RightFormStatus";
import { rswitch } from "rswitch";
import CourseInformationForm from "./form/CourseInformationForm";
import { Button, Modal, useDisclosure } from "@nextui-org/react";

import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import CourseOptionsForm from "./form/CourseOptionsForm";
import CourseContentForm from "./form/CourseContentForm";
import CoursePreview from "./form/CoursePreview";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  CATEGORIES_QUERY,
  CREATE_COURSE,
  MUX_UPLOAD_URL,
} from "@/graphql/queries";
import useUserData from "@/shared/hooks/useUserData";
import { graphql } from "graphql";
import VideoUploadModal, { UploadItemType } from "./VideoUploadModal";
import * as UpChunk from "@mux/upchunk";
import { nanoid } from "nanoid";
import api from "@/shared/api";
import axios from "axios";
import useUploadFiles from "@/shared/hooks/use-upload-files";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const informationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  demo_file: yup.mixed().required(),
  price: yup.number().required(),
  estimated_price: yup
    .mixed()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    ) // Convert empty string to undefined
    .nullable() // Allow null values
    .typeError("estimated_price must be a number") // Custom type error message
    .test(
      "moreThanPrice",
      "Estimated price must be more than the price",
      function (estimatedPrice) {
        const price: any = this.resolve(yup.ref("price")); // Get the value of 'price' from the context
        // Skip validation if price or estimatedPrice is undefined or null
        if (
          price === undefined ||
          price === null ||
          estimatedPrice === undefined ||
          estimatedPrice === null
        ) {
          return true;
        }
        // Perform the validation
        return estimatedPrice > price;
      }
    )
    .optional(),
  duration: yup.string().required(),
  level: yup.string().required(),
  language: yup.string().required(),
  course_tags: yup.string().required(),
  course_category: yup.string().required(),
  course_subcategory: yup.string().required(),
  popular_topics: yup.string().required(),
  thumbnail: yup.mixed().required(),
});

const optionSchema = yup.object({
  what_you_will_learn: yup.array(yup.string().required()).min(1),
  course_requirements: yup.array(yup.string().required()).min(1),
});

const contentSchema = yup.object({
  section: yup
    .array(
      yup.object({
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
      })
    )
    .min(1),
});

type Props = {
  type?: "edit" | "create";
};

function CreateCourseComponent({ type = "create" }: Props) {
  const [createCourseSchema, setCreateCourseSchema] =
    useState(informationSchema);

  const { data: categoryData } = useQuery(CATEGORIES_QUERY);

  const [formStatus, setFormStatus] = useState<FormStatusType>("information");
  const [createCourse] = useMutation(CREATE_COURSE);
  const router = useRouter();

  const handleChangeStatus = (s: FormStatusType) => {
    setFormStatus(s);
  };

  const methods = useForm<any>({
    resolver: yupResolver(createCourseSchema),
    defaultValues: {
      section: [{ section_name: "Untitled", content: [{}] }],
      what_you_will_learn: [""],
      course_requirements: [""],
    },
  });

  const { filesUploader, showUploadingFiles, uploadFiles, updateUploadFiles } =
    useUploadFiles();
  const normalizeInput = useNormalizeInput();

  const {
    isOpen: uploadModal,
    onOpenChange: uploadModalChange,
    onClose,
  } = useDisclosure();

  const onSubmit = async (data: any) => {
    if (formStatus == "information") {
      const newCourseSchema = createCourseSchema.concat(optionSchema);
      setCreateCourseSchema(newCourseSchema);
      handleChangeStatus("options");
    }
    if (formStatus == "options") {
      const newCourseSchema = createCourseSchema.concat(contentSchema);
      setCreateCourseSchema(newCourseSchema);
      handleChangeStatus("content");
    }
    if (formStatus == "content") {
      handleChangeStatus("preview");
    }

    if (formStatus != "preview") {
      return;
    }

    try {
      await showUploadingFiles(data);
      uploadModalChange();
      let d = await filesUploader(data);
      d.slug = generateSlug(d.title);
      const input = normalizeInput(d);
      await createCourse({
        variables: {
          input,
        },
      });
      router.push("/courses");
      toast.success("Course created");
    } catch (err: any) {
      toast.error("Error occurred " + err?.message);
      updateUploadFiles([]);
      onClose();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="max-md:pt-[20px]"></div>

        <RightFormStatus status={formStatus} />
        <div className="pt-[30px]"></div>
        <div className="flex flex-col gap-4 w-full p-[30px] rounded-[14px] shadow-xl border border-bcolor">
          {rswitch(formStatus, {
            information: (
              <CourseInformationForm
                categoryData={categoryData?.categories || []}
                onChangeStatus={handleChangeStatus}
              />
            ),
            options: <CourseOptionsForm onChangeStatus={handleChangeStatus} />,
            content: <CourseContentForm onChangeStatus={handleChangeStatus} />,
            preview: (
              <CoursePreview
                data={methods.getValues()}
                onChangeStatus={handleChangeStatus}
              />
            ),
          })}
        </div>

        <Modal isOpen={uploadModal} onOpenChange={uploadModalChange}>
          <VideoUploadModal uploadFiles={uploadFiles} />
        </Modal>
      </form>
    </FormProvider>
  );
}

function useNormalizeInput() {
  const { userData } = useUserData();
  return (d: any) => ({
    ...d,
    price: Number(d.price),
    estimated_price: Number(d.estimated_price),
    section: {
      create: d.section.map((s: any) => ({
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
      })),
    },
    teacher: { connect: { id: Number(userData?.id) } },
  });
}

function generateSlug(title: string) {
  const randomString = Math.random().toString(36).substring(2, 8);
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `${baseSlug}-${randomString}`;
}

export default CreateCourseComponent;
