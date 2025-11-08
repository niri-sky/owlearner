"use client";
// global package
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import {
  IoIosArrowDown,
  IoIosSearch,
  IoMdAddCircleOutline,
} from "react-icons/io";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  cn,
  Spinner,
} from "@nextui-org/react";
// custop files import
import * as yup from "yup";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY,
  INVITE_ORGANIZATION,
  ORGANIZATIONS_QUERY,
  UPDATE_CATEGORY,
} from "@/graphql/queries";
import toast from "react-hot-toast";
import InputField from "@/shared/field/InputField";
import { AiOutlineDelete } from "react-icons/ai";
import { LuPlusSquare } from "react-icons/lu";

const formSchema = yup.object({
  name: yup.string().required(),
  subcategories: yup.array(
    yup.object({
      name: yup.string().required(),
      topics: yup.array(
        yup.object({
          name: yup.string().required(),
        })
      ),
    })
  ),
});

type Props = {
  data?: CategoryDataType;
  type?: "create" | "edit";
};

function CategoryModal({ data, type = "create" }: Props) {
  const [createCategory, { loading: loading1 }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [CATEGORIES_QUERY],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Category created");
    },
    onError: (err) => {
      console.log(err);

      toast.error("Something went wrong!");
    },
  });

  const [updateCategory, { loading: loading2 }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [CATEGORIES_QUERY],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Category updated");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong!");
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: data
      ? data
      : {
          subcategories: [
            {
              topics: [{}],
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    name: "subcategories",
    control,
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) => {
            const newData = prismalizeData(d);
            if (type == "create") {
              createCategory({
                variables: {
                  input: newData,
                },
              }).then(onClose);
            }
            if (type == "edit") {
              updateCategory({
                variables: {
                  id: Number(data?.id),
                  input: newData,
                },
              }).then(onClose);
            }
          })}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            {type == "create" ? "Create" : "Edit"} Category
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-3">
              <InputField
                errors={errors}
                placeholder="category name"
                label="Category Name"
                {...register("name")}
              />

              <div className="flex items-center justify-between">
                <div className="font-semibold">Sub Categories</div>
              </div>

              <div className="flex flex-col gap-4">
                {fields.map((f, i) => (
                  <SubCategory
                    index={i}
                    key={f.id}
                    name={`subcategories.${i}`}
                    control={control}
                    register={register}
                    onRemove={() => remove(i)}
                    errors={errors}
                  />
                ))}
              </div>

              <div className="flex justify-center items-center">
                <Button
                  onClick={() => {
                    append({
                      name: "",
                      topics: [{ name: "" }],
                    });
                  }}
                  color="primary"
                  variant="flat"
                  startContent={<LuPlusSquare />}
                >
                  Add New
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={loading1 || loading2}
              isIconOnly={loading1 || loading2}
              className="min-w-[80px]"
              startContent={
                (loading1 || loading2) && <Spinner size="sm" color="default" />
              }
            >
              {!(loading1 || loading2) && type == "create" ? "Add" : "Update"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

function prismalizeData(d: yup.InferType<typeof formSchema>) {
  return {
    name: d.name,
    subcategories: Object.assign({
      create: d.subcategories?.map((v) => ({
        name: v.name,
        topics: { create: v.topics?.map((t) => ({ name: t.name })) },
      })),
    }),
  };
}

type SubProps = {
  control?: Control<any>;
  register: UseFormRegister<any>;
  name: string;
  index: number;
  onRemove: () => any;
  errors: FieldErrors<any>;
};

function SubCategory({
  name,
  register,
  control,
  index,
  onRemove,
  errors,
}: SubProps) {
  const subcategoryName = useWatch({ control, name: `${name}.name` });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.topics`,
  });

  return (
    <div className="bg-purple-50 p-3 rounded">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">
          {index + 1}. {subcategoryName || "untitled"}{" "}
        </div>

        <div>
          <Button onClick={onRemove} isIconOnly color="danger" variant="light">
            <AiOutlineDelete size={20} />
          </Button>
          <Button isIconOnly color="primary" variant="light">
            <IoIosArrowDown
              size={20}
              className={cn("transition-all duration-200")}
            />
          </Button>
        </div>
      </div>
      <div>
        <div className="pt-1"></div>
        <div className="flex-1">
          <InputField
            placeholder="subcategory name"
            {...register(`${name}.name`)}
            errors={errors}
          />
        </div>
        <div className="pt-3"></div>
        <div className="flex items-center justify-between">
          <div className="font-semibold">Topics</div>
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
              Add More
            </Button>
          </div>
        </div>
        <div className="pt-2"></div>

        <div className="bg-indigo-100 rounded p-3">
          <div className="flex flex-col gap-3">
            {fields.map((f, i) => (
              <div key={f.id} className="flex items-center justify-between">
                <div className="w-[calc(100%-50px)] flex gap-4">
                  <InputField
                    placeholder="write topic"
                    {...register(`${name}.topics.${i}.name`)}
                    errors={errors}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
