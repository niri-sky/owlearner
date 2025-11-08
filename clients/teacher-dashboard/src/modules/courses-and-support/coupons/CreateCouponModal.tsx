"use client";
// global package
import { Box } from "@mui/material";
import Image from "next/image";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AiOutlinePlus } from "react-icons/ai";
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
  Spinner,
} from "@nextui-org/react";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { formatDate } from "@/shared/utils";
import { Controller, useForm } from "react-hook-form";
import InputField from "../create-course/field/InputField";
import { useMutation, useQuery } from "@apollo/client";
import {
  COUPONS_QUERY,
  CREATE_COUPON,
  TEACHER_COURSES_QUERY,
  UPDATE_COUPON,
} from "@/graphql/queries";
import useUserData from "@/shared/hooks/useUserData";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { rswitch } from "rswitch";
import { CouponDataTypes } from ".";

const createCouponSchema = yup.object({
  name: yup.string().required(),
  code: yup.string().required(),
  discount: yup.number().required(),
  type: yup.string().required(),
  // course: yup.mixed(),
});

type Props = {
  courseData: any[];
  type?: "create" | "edit";
  prevData?: any;
};

function CreateCouponModal({ courseData, type = "create", prevData }: Props) {
  const { userData } = useUserData();

  const [createCoupon, { loading }] = useMutation(
    rswitch(type, { create: CREATE_COUPON, edit: UPDATE_COUPON }),
    {
      refetchQueries: [
        {
          query: COUPONS_QUERY,
          variables: { where: { teacherId: { equals: Number(userData?.id) } } },
        },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success(
          rswitch(type, {
            create: "Coupon created",
            edit: "Coupon updated",
          })
        );
      },
      onError: (err) => {
        toast.error("Error occured " + err.message);
      },
    }
  );

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCouponSchema),
    defaultValues: prevData || {},
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          onSubmit={handleSubmit((d) =>
            createCoupon({
              variables: rswitch(type, {
                create: {
                  input: {
                    ...d,
                    // course: { connect: { id: Number(d?.course?.id) } },
                    teacher: { connect: { id: Number(userData?.id) } },
                  },
                },
                edit: {
                  id: Number(prevData?.id),
                  input: {
                    name: d.name,
                    code: d.code,
                    type: d.type,
                    discount: d.discount,
                  },
                },
              }),
            }).then(onClose)
          )}
        >
          <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
            {rswitch(type, {
              create: "Create new coupon",
              edit: "Coupon Details",
            })}
          </ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-4">
              <div>
                <InputField
                  label="Coupon Name"
                  {...register("name")}
                  placeholder="enter coupon name"
                />
              </div>
              <div>
                <InputField
                  label="Coupon Code"
                  {...register("code")}
                  placeholder="enter coupon code"
                />
              </div>
              {/* <div>
                <label
                  className="font-semibold text-[14px] block  leading-[19.07px]   capitalize text-[#444444]  mb-[10px]"
                  htmlFor={"course"}
                >
                  Select Course
                </label>
                <Controller
                  name={`course.id`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      items={courseData.map((_, jj) => ({
                        value: _?.id,
                        label: _?.title,
                      }))}
                      label="select course"
                      size="sm"
                      onChange={onChange}
                      isDisabled={type === "edit"}
                      onBlur={onBlur}
                      selectedKeys={value ? [value] : []}
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
              </div> */}
              <div>
                <label
                  className="font-semibold text-[14px] block  leading-[19.07px]   capitalize text-[#444444]  mb-[10px]"
                  htmlFor={"course"}
                >
                  Coupon Discount
                </label>
                <div className=" flex flex-row justify-between gap-4">
                  <div className="w-[calc(100%-140px)]">
                    <InputField
                      errors={errors}
                      {...register(`discount`)}
                      placeholder="enter coupons discount"
                      type="number"
                    />
                  </div>
                  <Controller
                    name={`type`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        items={[
                          { value: "percent", label: "Percent" },
                          { value: "amount", label: "Amount" },
                        ]}
                        label="Type"
                        size="sm"
                        onChange={onChange}
                        onBlur={onBlur}
                        selectedKeys={value ? [value] : []}
                        className=" max-w-[130px]"
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
              </div>
            </div>
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
              {!loading && rswitch(type, { create: "Add", edit: "Update" })}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default CreateCouponModal;
