"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spinner, cn } from "@nextui-org/react";
import { useMutation } from "@apollo/client";
import { RESEND_STUDENT_VERIFY, RESET_STUDENT_PASSWORD, STUDENT_VERIFY } from "@/graphql/queries";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ResendEmailButton from "./ResendEmailButton";

const formSchema = yup.object({
  code: yup.string().required(),
});

type FormType = {
  code: string;
};

const VerifyEmail = () => {
  const [verifyEmail] = useMutation(STUDENT_VERIFY);

  const [resendStudentVerify] = useMutation(RESEND_STUDENT_VERIFY)


  const router = useRouter();
  const params = useParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: yupResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (isLoading) return;
    const { email, token } = params;
    try {
      if (!email || !token) {
        throw new Error("Request invalid");
      }
      setIsLoading(true);
      const result = await verifyEmail({
        variables: {
          input: {
            code: d.code,
            email: decodeURIComponent(email as string),
            token,
          },
        },
      });
      router.push("/auth/signup/success");
      toast.success("Email verified");
      // setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setIsLoading(false);
    }
  };

  const handleResendEmail = ()=>{
    if(!params.token) return;

    resendStudentVerify({variables:{
      token:params.token
    }})

  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center h-full md:py-16 py-12"
    >
      <div className=" sm:w-[450px] w-[90%] mx-auto rounded-xl md:p-[30px] p-[22px] shadow-md border border-bColor flex flex-col md:gap-3 gap-2">
        <div>
          <h2 className="md:text-[28px] text-[25px] font-semibold text-title">
            Verify Email
          </h2>
        </div>
        <div className="pb-4">
          <p>
            We&apos;ve sent a verification code to the email address{" "}
            <span className="font-semibold ">
              {decodeURIComponent(params?.email as string)}
            </span>
            .
          </p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <input
            type="text"
            className={cn(
              "py-3 px-3 rounded-md border border-bColor outline-none w-full",
              errors.code && "border-red-500"
            )}
            placeholder="enter verify code"
            {...register("code")}
          />
          {errors.code && (
            <div className="text-sm text-red-500">
              {errors.code.message?.toString()}
            </div>
          )}
          <div className="w-full">
            <button
              disabled={isLoading}
              className="bg-[#C713CB] w-full hover:bg-[#a409a7] text-[white] h-[50px] px-10 border-none outline-none rounded-md capitalize"
            >
              {isLoading ? (
                <Spinner
                  classNames={{
                    wrapper: "w-6 h-6",
                    circle1: "border-b-white",
                    circle2: "border-b-white",
                  }}
                />
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <div className="pt-4">

          <ResendEmailButton handleResendEmail={handleResendEmail} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default VerifyEmail;
