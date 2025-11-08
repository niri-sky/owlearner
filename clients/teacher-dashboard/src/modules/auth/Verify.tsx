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
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useMutation } from "@apollo/client";

import * as yup from "yup";
import { RESEND_TEACHER_VERIFY, TEACHER_VERIFY } from "@/graphql/queries";
import ResendEmailButton from "./ResendEmailButton";

const VerifySchema = yup.object({
  code: yup.string().required("Code is required"),
});

type VerifyType = {
  code: string;
};

const VerifyPage: React.FC = () => {
  const [verifyTeacher] = useMutation(TEACHER_VERIFY);

  const [resendTeacherVerify] = useMutation(RESEND_TEACHER_VERIFY)

  const params = useParams();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyType>({
    resolver: yupResolver(VerifySchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<VerifyType> = async (d) => {
    if (isLoading) return;
    const { email, token } = params;
    try {
      if (!email || !token) {
        throw new Error("Request invalid");
      }
      setIsLoading(true);
      const result = await verifyTeacher({
        variables: {
          input: {
            code: d.code,
            email: decodeURIComponent(email as string),
            token,
          },
        },
      });
      router.push("/signup/success");
      toast.success("Email verifed");
      // setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  const handleResendEmail = ()=>{
    if(!params.token) return;

    resendTeacherVerify({variables:{
      token:params.token
    }})

  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center gap-3 h-screen"
    >
      <div className="flex flex-col md:gap-[25px] sm:gap-[15px] gap-3 sm:w-[450px] w-[95%]  mx-auto md:py-[60px] md:px-[40px] py-[40px] sm:px-[25px] px-[20px] shadow-md rounded-md bg-[white] border border-bcolor">
        <div className="w-full text-center ">
          <h2 className="md:text-3xl text-2xl font-semibold text-gray-800">
            Email Verify
          </h2>
          <div className="pt-2"></div>
          <div className="text-sm">
            We&apos;ve sent a verification code to the email address{" "}
            <span className="font-semibold ">
              {decodeURIComponent(params?.email as string)}
            </span>
            .
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="text-[#2a3547] text-sm" htmlFor="">
            Verify Code
          </label>
          <input
            className={cn(
              "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
              errors.code && "!border-red-500"
            )}
            type="text"
            placeholder="Enter verify code"
            {...register("code")}
          />

          {errors.code && (
            <div className="text-sm text-red-500">
              {errors.code.message?.toString()}
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
              <span>Verify</span>
            )}
          </button>
        </div>
        <div>
          <ResendEmailButton handleResendEmail={handleResendEmail} />
        </div>
      </div>
    </form>
  );
};

export default VerifyPage;
