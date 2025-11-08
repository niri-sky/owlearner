import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import * as yup from "yup";
import CourseInformationForm from "../create-course/form/CourseInformationForm";
import CourseOptionsForm from "../create-course/form/CourseOptionsForm";
import {
  CATEGORIES_QUERY,
  SINGLE_COURSES_QUERY,
  UPDATE_COURSE,
} from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

type Props = {
  data: CourseData;
};

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
        const price = this.resolve(yup.ref("price")); // Get the value of 'price' from the context
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
  what_you_will_learn: yup.array(yup.string().required()).min(1),
  course_requirements: yup.array(yup.string().required()).min(1),
});

function EditInformationOptionModal({ data }: Props) {
  const { data: categoryData } = useQuery(CATEGORIES_QUERY);

  const {
    section,
    id,
    __typename,
    teacher,
    updatedAt,
    createdAt,
    studentCourse,
    reviews,
    ...defaultData
  } = data;

  console.log("section data", section);

  const methods = useForm<any>({
    resolver: yupResolver(informationSchema),
    defaultValues: { ...defaultData },
  });

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

  const handleChangeStatus = () => {};

  return (
    <ModalContent>
      {(onClose) => (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((d) =>
              updateCourse({
                variables: {
                  id: Number(id),
                  input: {
                    ...d,
                  },
                },
              }).then(onClose)
            )}
          >
            <ModalHeader>Edit Information and Options</ModalHeader>
            <ModalBody>
              <CourseInformationForm
                categoryData={categoryData?.categories || []}
                onChangeStatus={handleChangeStatus}
                isButton={false}
              />
              <CourseOptionsForm
                onChangeStatus={handleChangeStatus}
                isButton={false}
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
                {!loading && "Update"}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      )}
    </ModalContent>
  );
}

export default EditInformationOptionModal;
