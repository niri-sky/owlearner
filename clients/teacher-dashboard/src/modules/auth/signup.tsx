"use client";
import React, { useState } from "react";
import { Link, Spinner, cn } from "@nextui-org/react";
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
import { useMutation } from "@apollo/client";
import { TEACHER_SIGNUP } from "@/graphql/queries";

const SignupSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required("Email is required").email(),
  password: yup.string().required("Password is required").min(8),
});

type SignupType = {
  name: string;
  email: string;
  password: string;
};
const Signup: React.FC = () => {
  const [teacherSignup] = useMutation(TEACHER_SIGNUP);

  const searchParams = useSearchParams();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>({
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      name: searchParams.get("name") || "",
      email: searchParams.get("email") || "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<SignupType> = async (d) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const organization = searchParams.get("organization");
      const result = await teacherSignup({
        variables: organization
          ? {
              input: d,
              organization: Number(organization),
            }
          : { input: d },
      });

      router.push(
        "/signup/verify/" +
          encodeURIComponent(d.email) +
          "/" +
          result?.data?.signupTeacher?.token
      );
      toast.success("Signup successfully");
      // setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  // show password
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // loading spinner
  //
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center gap-3 h-screen"
    >
      <div className="flex flex-col md:gap-[25px] sm:gap-[15px] gap-3 sm:w-[450px] w-[95%]  mx-auto md:py-[60px] md:px-[40px] py-[40px] sm:px-[25px] px-[20px] shadow-md rounded-md bg-[white] border border-bcolor">
        <div className="w-full text-center md:pb-6 sm:pb-4 pb-2">
          <h2 className="md:text-3xl text-2xl font-semibold text-gray-800">
            Signup with {APP_NAME}
          </h2>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="text-[#2a3547] text-sm" htmlFor="">
            Enter your name
          </label>
          <input
            className={cn(
              "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
              errors.name && "!border-red-500"
            )}
            type="text"
            placeholder="your name"
            {...register("name")}
          />

          {errors.name && (
            <div className="text-sm text-red-500">
              {errors.name.message?.toString()}
            </div>
          )}
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
        <div className="flex flex-col w-full gap-2">
          <label className="text-[#2a3547] text-sm" htmlFor="">
            Enter your password
          </label>
          <div className="w-full relative">
            <input
              className={cn(
                "md:py-4 py-3 pl-3 pr-[40px] border border-[#e0e0e0] rounded-md outline-[#dcdcdc] hover:border-[black] text-[#000000de] w-full",
                errors.password && "!border-red-500"
              )}
              type={showPassword ? "text" : "password"}
              placeholder="password!@%"
              {...register("password")}
            />
            <span
              className="absolute right-[12px] md:top-[17px] top-[13px] cursor-pointer text-[gray]"
              onClick={handleTogglePassword}
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
          </div>
          {errors.password && (
            <div className="text-sm text-red-500">
              {errors.password.message?.toString()}
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
              <span>Signup</span>
            )}
          </button>
        </div>
        <div className="text-center">
          Already have an account?{" "}
          <Link className="font-bold text-primary" href={"/signin"}>
            Signin
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Signup;
