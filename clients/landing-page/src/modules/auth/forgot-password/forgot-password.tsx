"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spinner, cn } from "@nextui-org/react";
import { useMutation } from "@apollo/client";
import { RESET_STUDENT_PASSWORD } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const formSchema = yup.object({
  email: yup.string().email().required(),
});

type FormType = {
  email: string;
};

const ForgotPassword = () => {
  const [resetPassword] = useMutation(RESET_STUDENT_PASSWORD);
  const router = useRouter();
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
    try {
      setIsLoading(true);
      const result = await resetPassword({
        variables: {
          input: d,
        },
      });
      router.push("/auth");
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
      className="flex flex-col justify-center h-full md:py-16 py-12"
    >
      <div className=" sm:w-[450px] w-[90%] mx-auto rounded-xl md:p-[30px] p-[22px] shadow-md border border-bColor flex flex-col md:gap-3 gap-2">
        <div>
          <h2 className="md:text-[28px] text-[25px] font-semibold text-title">
            Password Reset
          </h2>
        </div>
        <div className="pb-4">
          <p>
            To reset your password, enter the email address you use to sign in
            to form
          </p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <input
            type="email"
            className={cn(
              "py-3 px-3 rounded-md border border-bColor outline-none w-full",
              errors.email && "border-red-500"
            )}
            placeholder="Email Address"
            {...register("email")}
          />
          {errors.email && (
            <div className="text-sm text-red-500">
              {errors.email.message?.toString()}
            </div>
          )}
          <div className="w-full">
            <button className="bg-[#C713CB] w-full hover:bg-[#a409a7] text-[white] h-[50px] px-10 border-none outline-none rounded-md capitalize">
              {isLoading ? (
                <Spinner
                  classNames={{
                    wrapper: "w-6 h-6",
                    circle1: "border-b-white",
                    circle2: "border-b-white",
                  }}
                />
              ) : (
                "Send reset link"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ForgotPassword;
