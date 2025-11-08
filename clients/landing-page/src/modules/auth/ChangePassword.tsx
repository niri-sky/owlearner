"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@nextui-org/react";
import { useMutation } from "@apollo/client";
import {
  CHANGE_STUDENT_PASSWORD,
  RESET_STUDENT_PASSWORD,
} from "@/graphql/queries";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const formSchema = yup.object({
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Password is required")
    .oneOf([yup.ref("password")], "Password not match"),
});

type FormType = {
  confirmPassword: string;
  password: string;
};

const ChangePassword = () => {
  const [changePassword] = useMutation(CHANGE_STUDENT_PASSWORD);
  const router = useRouter();
  const { token } = useParams();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: yupResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const result = await changePassword({
        variables: {
          token: token,
          input: d,
        },
      });
      router.push("/auth");
      reset();
      toast.success("Password set successfully");
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center h-full md:py-16 py-12"
    >
      <div className=" sm:w-[450px] w-[90%] mx-auto rounded-xl md:p-[30px] p-[22px] shadow-md border border-bColor flex flex-col md:gap-3 gap-2">
        <div>
          <h2 className="md:text-[28px] text-[25px] font-semibold text-title">
            Change Password
          </h2>
        </div>
        <div className="pb-4">
          <p>
            To change your password, enter the password and confirm password
          </p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <input
            type="password"
            className={cn(
              "py-3 px-3 rounded-md border border-bColor outline-none w-full",
              errors.password && "border-red-500"
            )}
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <div className="text-sm text-red-500">
              {errors.password.message?.toString()}
            </div>
          )}
          <input
            type="password"
            className={cn(
              "py-3 px-3 rounded-md border border-bColor outline-none w-full",
              errors.password && "border-red-500"
            )}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <div className="text-sm text-red-500">
              {errors.confirmPassword.message?.toString()}
            </div>
          )}
          <div className="w-full">
            <button className="bg-[#C713CB] w-full hover:bg-[#a409a7] text-[white] py-3 px-10 border-none outline-none rounded-md capitalize">
              Set Password
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
