import React, { useEffect } from "react";
import { FormProps } from "./CourseInformationForm";
import {
  UseFieldArrayProps,
  UseFormRegister,
  useFieldArray,
  useFormContext,
  useFormState,
} from "react-hook-form";
import InputField from "../field/InputField";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import _ from "lodash";

function CourseOptionsForm({ onChangeStatus, isButton = true }: FormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <OptionsForm
        register={register}
        control={control}
        label="What you will learn in this course"
        name="what_you_will_learn"
      />
      <div className="pt-[30px]"></div>

      <OptionsForm
        register={register}
        control={control}
        label="Course requirements"
        name="course_requirements"
      />
      <div className="pt-[30px]"></div>

      <div className=""></div>
      {isButton && (
        <div className="flex items-center justify-between">
          <div>
            <Button
              color="primary"
              variant="light"
              startContent={<IoArrowBack />}
              onClick={() => onChangeStatus("information")}
            >
              <span className="hidden sm:block">Prev</span>
            </Button>
          </div>
          <div>
            <Button
              // onClick={() => onChangeStatus("content")}
              type="submit"
              color="primary"
              endContent={<IoArrowForward />}
            >
              <span className="hidden sm:block">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseOptionsForm;

type OptionsProps = UseFieldArrayProps & {
  label: string;
  register: UseFormRegister<any>;
};

function OptionsForm({ label, register, ...props }: OptionsProps) {
  const labelStyle =
    "font-semibold text-[16px]  flex items-center gap-3 justify-between leading-[19.07px]   capitalize text-[#444444] inline-block";

  const { fields, append, remove } = useFieldArray(props);

  const { errors } = useFormState({ control: props.control });

  const error = _.get(errors, props.name);

  useEffect(() => {
    if (!fields.length) {
      append("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full">
      <label className={`${labelStyle}`} htmlFor={props.name}>
        {label}
      </label>
      {error && (
        <div className="text-sm text-red-500">{error.message?.toString()}</div>
      )}
      <div className="pt-5"></div>
      <div className="flex flex-col gap-5">
        {fields.map((f, i) => (
          <div className="flex items-center justify-between" key={f.id}>
            <div className="w-[calc(100%-50px)]">
              <InputField errors={errors} {...register(`${props.name}.${i}`)} />
            </div>
            <div>
              <Button
                className="min-w-[40px] px-0"
                variant="light"
                color="danger"
                onClick={() => {
                  remove(i);
                }}
              >
                <AiOutlineDelete size={20} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2"></div>
      <div>
        <Button
          onClick={() => {
            append("");
          }}
          variant="light"
          color="primary"
          startContent={<IoMdAddCircleOutline />}
        >
          Add More
        </Button>
      </div>
    </div>
  );
}
