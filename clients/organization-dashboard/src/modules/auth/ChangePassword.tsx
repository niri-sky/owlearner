"use client";
import React, { useState } from "react";
import { Spinner, cn } from "@nextui-org/react";
import {
  VisibilityIcon,
  VisibilityOffIcon,
} from "@/shared/components/admin-sidebar/elements/icons";
import { APP_NAME } from "@/app/configs/constants";
import {
  SubmitHandler,
  UseControllerProps,
  useController,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter, useParams } from "next/navigation";

import * as yup from "yup";
import { useMutation } from "@apollo/client";
import {
  ACCEPT_INVITE_ADMIN,
  CHANGE_ORGANIZATION_PASSWORD,
  CHANGE_TEACHER_PASSWORD,
  UPDATE_ADMIN,
} from "@/graphql/queries";

const InviteSchema = yup.object({
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Password is required")
    .oneOf([yup.ref("password")], "Password not match"),
});

type InviteType = {
  confirmPassword: string;
  password: string;
};
const ChangePassword: React.FC = () => {
  const [changePassword] = useMutation(CHANGE_ORGANIZATION_PASSWORD);
  const { token } = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteType>({
    resolver: yupResolver(InviteSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<InviteType> = async (d) => {
    if (isLoading || !token) return;
    try {
      setIsLoading(true);
      await changePassword({
        variables: {
          token: token,
          input: d,
        },
      });
      router.push("/signin");
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
      className="flex flex-col justify-center items-center gap-3 h-screen"
    >
      <div className="flex flex-col md:gap-[25px] sm:gap-[15px] gap-3 sm:w-[450px] w-[95%]  mx-auto md:py-[60px] md:px-[40px] py-[40px] sm:px-[25px] px-[20px] shadow-md rounded-md bg-[white] border border-bcolor">
        <div className="w-full text-center md:pb-6 sm:pb-4 pb-2">
          <h2 className="md:text-3xl text-2xl font-semibold text-gray-800">
            Change Your Password
          </h2>
        </div>

        <PasswordField
          label="New Password"
          name="password"
          control={control}
          defaultValue=""
        />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          control={control}
          defaultValue=""
        />
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
              <span>Set Password</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

type FieldProps = UseControllerProps<any> & { label: string };

function PasswordField({ label, ...props }: FieldProps) {
  // show password
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // loading spinner
  //
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const {
    formState: { errors },
    field,
  } = useController(props);

  return (
    <div className="flex flex-col w-full gap-2">
      <label className="text-[#2a3547] text-sm" htmlFor="">
        {label}
      </label>
      <div className="w-full relative">
        <input
          className={cn(
            "md:py-4 py-3 pl-3 pr-[40px] border border-[#e0e0e0] rounded-md outline-none focus:outline-none hover:border-[black] text-[#000000de] w-full",
            errors[props.name] && "!border-red-500 "
          )}
          type={showPassword ? "text" : "password"}
          placeholder="password!@%"
          {...field}
        />
        <span
          className="absolute right-[12px] md:top-[17px] top-[13px] cursor-pointer text-[gray]"
          onClick={handleTogglePassword}
        >
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </span>
      </div>
      {errors[props.name] && (
        <div className="text-sm text-red-500">
          {errors?.[props.name]?.message?.toString()}
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
