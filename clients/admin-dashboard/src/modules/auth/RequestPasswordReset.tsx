"use client";
import React, { useState } from "react";
import { Spinner, cn } from "@nextui-org/react";
import {
  VisibilityIcon,
  VisibilityOffIcon,
} from "@/shared/components/admin-sidebar/elements/icons";
import { APP_NAME } from "@/app/configs/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

import * as yup from "yup";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { RESET_ADMIN_PASSWORD } from "@/graphql/queries";

const formSchema = yup.object({
  email: yup.string().required("Email is required").email(),
});

type FormType = {
  email: string;
};
const RequestPasswordReset: React.FC = () => {
  const [resetPassword] = useMutation(RESET_ADMIN_PASSWORD);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(formSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const result = await resetPassword({
        variables: {
          input: d,
        },
      });
      router.push("/signin");
      toast.success("Reset password requested, Please check your mail");
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center gap-3 h-screen"
    >
      <div className="flex flex-col md:gap-[25px] sm:gap-[15px] gap-3 sm:w-[450px] w-[95%]  mx-auto md:py-[60px] md:px-[40px] py-[40px] sm:px-[25px] px-[20px] shadow-md rounded-md bg-[white] border border-bcolor">
        <div className="w-full text-center md:pb-6 sm:pb-4 pb-2">
          <h2 className="md:text-3xl text-2xl font-semibold text-gray-800">
            Forgot Passowrd
          </h2>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="text-[#2a3547] text-sm" htmlFor="">
            Enter your Email
          </label>
          <input
            className={cn(
              "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
              errors.email && "!border-red-500"
            )}
            type="email"
            placeholder="example@gmail.com"
            {...register("email")}
          />

          {errors.email && (
            <div className="text-sm text-red-500">
              {errors.email.message?.toString()}
            </div>
          )}
        </div>

        <div className="w-full">
          <button
            type="submit"
            className={`w-full rounded-md py-3 px-5 border-none outline-none  hover:bg-[#5280ff] text-[white] capitalize flex items-center gap-2 justify-center ${
              isLoading ? "!bg-[gray] cursor-not-allowed" : "bg-[#5d87ff]"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="relative top-[3.5px]">
                <Spinner size="sm" color="default" />
              </span>
            ) : (
              <span>Request</span>
            )}
          </button>
        </div>
        <div className="text-center">
          Remember your password?{" "}
          <Link className="font-bold text-primary" href={"/signin"}>
            Login
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RequestPasswordReset;
