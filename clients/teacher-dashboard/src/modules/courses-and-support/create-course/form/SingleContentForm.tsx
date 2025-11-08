import { Button, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoMdAddCircleOutline } from "react-icons/io";
import InputField from "../field/InputField";
import TextField from "../field/TextField";
import { motion } from "framer-motion";
import {
  Controller,
  UseControllerProps,
  UseFieldArrayProps,
  UseFormRegister,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { cn } from "@/shared/utils";
import FileField from "../field/FileField";
import FileInputField from "../field/FileInputField";
import { MdAssignmentAdd } from "react-icons/md";

type Props = {
  name: string;
  index: number;
  onRemove: () => any;
};

function SingleContentForm({ name, index, onRemove }: Props) {
  const {
    control,
    register,
    unregister,
    formState: { errors },
  } = useFormContext();

  const [isWrap, setWrap] = useState(true);

  const [assignmentWrap, setAssignmentWrap] = useState(false);

  return (
    <div className="flex bg-bcolor p-4 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <VideoTitle
            index={index + 1}
            name={`${name}.video_title`}
            control={control}
          />
        </div>
        <div>
          <Button onClick={onRemove} isIconOnly color="danger" variant="light">
            <AiOutlineDelete size={20} />
          </Button>
          <Button
            onClick={() => setWrap(!isWrap)}
            isIconOnly
            color="primary"
            variant="light"
          >
            <IoIosArrowDown
              size={20}
              className={cn(
                "transition-all duration-200",
                isWrap && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>
      <motion.div
        className="overflow-hidden flex flex-col  gap-4"
        initial={{ height: 0 }}
        animate={{ height: isWrap ? "auto" : 0 }}
      >
        <div className="w-full">
          <div className="pt-2"></div>
          <InputField
            errors={errors}
            {...register(`${name}.video_title`)}
            label="Video Title"
            placeholder="Enter video title"
          />
        </div>

        <div className="w-full">
          <TextField
            label="Video Description"
            name={`${name}.video_description`}
            control={control}
            errors={errors}
          />
        </div>
        <div className="w-full">
          <FileField
            label="Video File"
            name={`${name}.file`}
            accept="video/mp4,video/x-m4v,video/*"
            control={control}
            errors={errors}
          />
        </div>

        <LinkComponent
          name={`${name}.links`}
          control={control}
          register={register}
        />

        {/* <ResourceComponent
          name={`${name}.resources`}
          control={control}
          register={register}
        /> */}

        <QuizComponent name={`${name}.quizzes`} />
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
          <AssignmentComponent name={`${name}.assignment`} />
        </motion.div>  */}
      </motion.div>
    </div>
  );
}

export default SingleContentForm;

type AssignmentProps = {
  name: string;
};

export function AssignmentComponent({ name }: AssignmentProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="p-5 bg-indigo-50 flex flex-col gap-3 rounded">
      <div className="w-full">
        <div className="pt-2"></div>
        <InputField
          errors={errors}
          {...register(`${name}.name`)}
          label="Assignment Name"
          placeholder="Enter assignment name"
        />
      </div>

      <div className="w-full">
        <TextField
          label="Assignment Details"
          name={`${name}.details`}
          control={control}
          errors={errors}
        />
      </div>

      <div className="w-full">
        <div className="pt-2"></div>
        <InputField
          errors={errors}
          type="datetime-local"
          {...register(`${name}.deadline`)}
          label="Assignment Deadline"
          placeholder="Enter assignment deadline"
        />
      </div>

      <div className="w-full">
        <div className="pt-2"></div>
        <InputField
          errors={errors}
          type="number"
          {...register(`${name}.mark`)}
          label="Assignment Mark"
          placeholder="Enter assignment mark"
        />
      </div>
    </div>
  );
}

type VideoTitleProps = {
  index: number;
} & UseFieldArrayProps;

function VideoTitle({ index, name, control }: VideoTitleProps) {
  const value = useWatch({ control, name });

  return (
    <div>
      <div className="font-semibold">
        {index}. {value || "Video title"}
      </div>
    </div>
  );
}

type LinkProps = UseFieldArrayProps & {
  register: UseFormRegister<any>;
};

export function LinkComponent({ register, ...props }: LinkProps) {
  const labelStyle =
    "font-semibold text-[16px]  flex items-center gap-3 justify-between leading-[19.07px]   capitalize text-[#444444] inline-block";

  const { fields, append, remove } = useFieldArray(props);

  const { errors } = useFormState({ control: props.control });

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <label className={`${labelStyle}`} htmlFor={props.name}>
          Link
        </label>
        <div>
          <Button
            onClick={() => {
              append({});
            }}
            variant="light"
            color="primary"
            className="h-fit w-fit  py-1 px-2 rounded-sm"
            startContent={<IoMdAddCircleOutline />}
          >
            Add More Link
          </Button>
        </div>
      </div>
      <div className="pt-2"></div>
      <div className="flex flex-col gap-5">
        {fields.map((f, i) => (
          <div className="flex items-center justify-between" key={f.id}>
            <div className="w-[calc(100%-50px)] flex gap-4">
              <div className="w-1/2">
                <InputField
                  errors={errors}
                  {...register(`${props.name}.${i}.title`)}
                  placeholder="link title"
                />
              </div>{" "}
              <div className="w-1/2">
                <InputField
                  errors={errors}
                  {...register(`${props.name}.${i}.link`)}
                  placeholder="link url"
                />
              </div>
            </div>
            <div>
              <Button
                className="min-w-[40px] px-0"
                variant="light"
                color="danger"
                isIconOnly
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
    </div>
  );
}

type ResourceProps = UseFieldArrayProps & {
  register: UseFormRegister<any>;
};

function ResourceComponent({ register, ...props }: ResourceProps) {
  const labelStyle =
    "font-semibold text-[16px]  flex items-center gap-3 justify-between leading-[19.07px]   capitalize text-[#444444] inline-block";

  const { fields, append, remove } = useFieldArray(props);

  const { errors } = useFormState({ control: props.control });

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <label className={`${labelStyle}`} htmlFor={props.name}>
          Resources
        </label>
        <div>
          <Button
            onClick={() => {
              append({});
            }}
            variant="light"
            color="primary"
            className="h-fit w-fit  py-1 px-2 rounded-sm"
            startContent={<IoMdAddCircleOutline />}
          >
            Add More Resource
          </Button>
        </div>
      </div>
      <div className="pt-2"></div>
      <div className="flex flex-col gap-5">
        {fields.map((f, i) => (
          <div className="flex items-center justify-between" key={f.id}>
            <div className="w-[calc(100%-50px)] flex gap-4">
              <div className="w-1/2">
                <InputField
                  errors={errors}
                  {...register(`${props.name}.${i}.name`)}
                  placeholder="name"
                />
              </div>{" "}
              <div className="w-1/2">
                <FileInputField
                  placeholder="File or Link"
                  name={`${props.name}.${i}.src`}
                  errors={errors}
                  control={props.control}
                />
              </div>
            </div>
            <div>
              <Button
                className="min-w-[40px] px-0"
                variant="light"
                color="danger"
                isIconOnly
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
    </div>
  );
}

type QuizProps = {} & UseFieldArrayProps;

export function QuizComponent({ ...props }: QuizProps) {
  const labelStyle =
    "font-semibold text-[16px]  flex items-center gap-3 justify-between leading-[19.07px]   capitalize text-[#444444] inline-block";

  const { fields, append, remove } = useFieldArray(props);

  const { errors } = useFormState({ control: props.control });

  const { register } = useFormContext();

  const { control } = useFormContext();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <label className={`${labelStyle}`} htmlFor={props.name}>
          Quiz
        </label>
        <div>
          <Button
            onClick={() => {
              append({});
            }}
            variant="light"
            color="primary"
            className="h-fit w-fit  py-1 px-2 rounded-sm"
            startContent={<IoMdAddCircleOutline />}
          >
            Add More Quiz
          </Button>
        </div>
      </div>
      <div className="pt-2"></div>
      <div className="flex flex-col gap-5">
        {fields.map((f, i) => (
          <div key={f.id}>
            <div className="flex items-center justify-between">
              <div className="w-[calc(100%-50px)] flex flex-row justify-between gap-4">
                <div className="w-[calc(100%-110px)]">
                  <InputField
                    errors={errors}
                    {...register(`${props.name}.${i}.title`)}
                    placeholder="Quiz title"
                  />
                </div>
                <Controller
                  name={`${props.name}.${i}.answer`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      items={[...Array(4)].map((_, jj) => ({
                        value: jj,
                        label: jj + 1 + "",
                      }))}
                      label="Answer"
                      size="sm"
                      onChange={onChange}
                      onBlur={onBlur}
                      selectedKeys={value ? [value] : []}
                      className=" max-w-[100px]"
                      classNames={{
                        trigger: "bg-[#F8F8F8] border border-[#E5DDED]",
                      }}
                    >
                      {(val) => (
                        <SelectItem key={val.value} value={val.value}>
                          {val.label}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                />
              </div>

              <div>
                <Button
                  className="min-w-[40px] px-0"
                  variant="light"
                  color="danger"
                  isIconOnly
                  onClick={() => {
                    remove(i);
                  }}
                >
                  <AiOutlineDelete size={20} />
                </Button>
              </div>
            </div>
            <div className="pt-3"></div>
            <div className="w-[calc(100%-50px)] flex flex-col gap-3">
              {[...Array(4)].map((_, j) => (
                <div
                  key={"gsdfs" + j}
                  className="flex items-center justify-between"
                >
                  <div className="font-semibold">{j + 1}.</div>
                  <div className="w-[calc(100%-20px)]">
                    <InputField
                      errors={errors}
                      {...register(`${props.name}.${i}.options.${j}`)}
                      placeholder={"quiz option " + (j + 1)}
                      className="!h-[40px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-2"></div>
    </div>
  );
}
