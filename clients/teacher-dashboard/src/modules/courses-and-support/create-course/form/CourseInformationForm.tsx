import React, { useEffect, useMemo } from "react";
import InputField from "../field/InputField";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useFormContext,
} from "react-hook-form";
import TextField from "../field/TextField";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { FormStatusType } from "../RightFormStatus";
import NewSectionFileField from "../field/NewSectionFileField";
import FileField from "../field/FileField";
import SelectField from "../field/SelectField";
import rswitch from "rswitch";

export type FormProps = {
  onChangeStatus: (s: FormStatusType) => any;
  isButton?: boolean;
};

interface RootObject {
  __typename: string;
  id: string;
  name: string;
  updatedAt: string;
  subcategories: Subcategory[];
}
interface Subcategory {
  __typename: string;
  id: string;
  name: string;
  topics: Topic[];
}
interface Topic {
  __typename: string;
  id: string;
  name: string;
}

function CourseInformationForm({
  onChangeStatus,
  categoryData,
  isButton = true,
}: FormProps & { categoryData: RootObject[] }) {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const selectedCategory = watch("course_category");
  const selectedSubCategory = watch("course_subcategory");

  const { categories, subcategories, topics } = useMemo(() => {
    const categories = categoryData?.map((v) => ({
      label: v.name,
      value: v.name,
    }));

    const activeCategory = categoryData.find((v) => v.name == selectedCategory);

    const subcategories = activeCategory?.subcategories.map((v) => ({
      label: v.name,
      value: v.name,
    }));

    const activeSubCategory = activeCategory?.subcategories.find(
      (v) => v.name == selectedSubCategory
    );

    const topics = activeSubCategory?.topics.map((v) => ({
      label: v.name,
      value: v.name,
    }));

    return { categories, subcategories, topics };
  }, [categoryData, selectedCategory, selectedSubCategory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <InputField
          errors={errors}
          {...register(`title`)}
          label="Course Title"
          placeholder="Enter course title"
        />
      </div>

      <div className="w-full">
        <TextField
          label="Course Description"
          name={`description`}
          control={control}
          errors={errors}
        />
      </div>

      <div className="w-full">
        <FileField
          label="Demo video"
          name={`demo_file`}
          accept="video/mp4,video/x-m4v,video/*"
          control={control}
          errors={errors}
        />
      </div>

      <div className="flex gap-5">
        <div className="w-1/2">
          <InputField
            errors={errors}
            {...register(`price`)}
            label="Course Price"
            type="number"
            placeholder="Enter course price"
            step="0.01"
          />
        </div>
        <div className="w-1/2">
          <InputField
            errors={errors}
            {...register(`estimated_price`)}
            label="Estimated Price (Optional)"
            type="number"
            placeholder="Enter estimated course price"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex gap-5">
        <div className="w-1/2">
          <InputField
            errors={errors}
            {...register(`duration`)}
            label="Course Duration"
            placeholder="Enter course duration"
          />
        </div>
        <div className="w-1/2">
          <InputField
            errors={errors}
            {...register(`level`)}
            label="Course Level"
            placeholder="Enter course level"
          />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="w-1/2">
          <InputField
            errors={errors}
            {...register(`language`)}
            label="Language"
            placeholder="Enter course language"
          />
        </div>
        <div className="w-1/2">
          <InputField
            errors={errors}
            {...register(`course_tags`)}
            label="Course Tags (use , to separate)"
            placeholder="Enter course tags"
          />
        </div>
      </div>

      <div>
        <SelectField
          label="Course Category"
          name="course_category"
          control={control}
          items={categories || []}
          placeholder="Choose course category"
        />
      </div>

      {watch("course_category") && (
        <div>
          <SelectField
            label="Course SubCategory"
            name="course_subcategory"
            control={control}
            items={subcategories || []}
            placeholder="Choose course subcategory"
          />
        </div>
      )}
      {watch("course_subcategory") && (
        <div>
          <SelectField
            label="Popular Topics"
            name="popular_topics"
            control={control}
            items={topics || []}
            placeholder="Choose course topics"
          />
        </div>
      )}

      <div>
        <NewSectionFileField
          label="Thumbnail"
          name="thumbnail"
          control={control}
          errors={errors}
        />
      </div>

      <div className=""></div>
      <div className="flex items-center justify-between">
        <div>
          {/* <Button
              color="primary"
              variant="light"
              startContent={<IoArrowBack />}
            >
              <span className="hidden sm:block">Prev</span>
            </Button> */}
        </div>
        {isButton && (
          <div>
            <Button
              // onClick={() => onChangeStatus("options")}
              type="submit"
              color="primary"
              endContent={<IoArrowForward />}
            >
              <span className="hidden sm:block">Next</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseInformationForm;
