"use client";
import React, { useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useMutation } from "@apollo/client";
import {
  SINGLE_STUDENT_QUERY,
  UPDATE_STUDENT_PASSWORD,
} from "@/graphql/queries";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import toast from "react-hot-toast";
import InputField from "@/shared/field/InputField";

const updatePasswordSchema = yup.object({
  currentPassword: yup.string().required().min(8),
  newPassword: yup.string().required().min(8),
  confirmPassword: yup.string().required().min(8),
});

type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PasswordFileds = () => {
  // states
  const [edit, setEdit] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdatePassword>({
    resolver: yupResolver(updatePasswordSchema),
  });

  const { profileData } = useProfileData();

  const [updatePassword, { loading }] = useMutation(UPDATE_STUDENT_PASSWORD, {
    refetchQueries: [
      {
        query: SINGLE_STUDENT_QUERY,
        variables: {
          id: Number(profileData?.id),
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success("Password Updated");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong");
    },
  });

  const onSubmit: SubmitHandler<UpdatePassword> = (d) => {
    updatePassword({
      variables: {
        id: Number(profileData?.id),
        input: d,
      },
    }).then(() => {
      setEdit(false);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col md:px-[30px] px-[20px] border rounded-xl bg-[white] border-[#e2e2e2]"
    >
      <div className="w-full flex justify-between items-center py-4 border-b border-[#e2e2e2]">
        <h2 className="md:text-[20px] text-lg font-semibold text-txt capitalize">
          Change Password
        </h2>
        <div className="flex items-center gap-3">
          {edit && (
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              isIconOnly={loading}
              className="min-w-[80px]"
              radius="sm"
              startContent={loading && <Spinner size="sm" color="default" />}
            >
              {!loading && "Update"}
            </Button>
          )}
          <Button
            onClick={() => {
              setEdit(!edit);
              reset();
            }}
            className="!text-[16px]"
            color="default"
            radius="sm"
          >
            {edit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      <ul className="flex flex-col gap-5 w-full py-4">
        <InputField
          type="password"
          label="Current Password"
          placeholder="enter current password"
          errors={errors}
          {...register("currentPassword")}
          disabled={!edit}
        />
        <InputField
          type="password"
          label="New Password"
          placeholder="enter new password"
          errors={errors}
          {...register("newPassword")}
          disabled={!edit}
        />
        <InputField
          type="password"
          label="Confirm Password"
          placeholder="enter confirm password"
          errors={errors}
          {...register("confirmPassword")}
          disabled={!edit}
        />
      </ul>
    </form>
  );
};

export default PasswordFileds;
