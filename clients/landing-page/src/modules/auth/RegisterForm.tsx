"use client";
import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spinner, cn } from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { STUDENT_SIGNUP } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const signupSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  confirmPassword: yup
    .string()
    .required("Password is required")
    .oneOf([yup.ref("password")], "Password not match"),
});

type FormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterForm() {
  const [signupStudent] = useMutation(STUDENT_SIGNUP);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(signupSchema),
  });

  const [loading, setLoding] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (loading) return;
    try {
      setLoding(true);
      const result = await signupStudent({
        variables: {
          input: { name: d.name, email: d.email, password: d.password },
        },
      });

      router.push(
        "/auth/email/" +
          encodeURIComponent(d.email) +
          "/verify/" +
          result?.data?.signupStudent?.token
      );
      toast.success("Signup successfully");
    } catch (error: any) {
      toast.error(error?.message);
      setLoding(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4"
    >
      <input
        type="text"
        className={cn(
          "py-3 px-3 rounded-md border border-bColor outline-none w-full",
          errors.name && "border-red-500"
        )}
        placeholder="Name"
        {...register("name")}
      />
      {errors.name && (
        <div className="text-sm text-error-500">
          {errors.name.message?.toString()}
        </div>
      )}
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
        <div className="text-sm text-error-500">
          {errors.email.message?.toString()}
        </div>
      )}
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
        <div className="text-sm text-error-500">
          {errors.password.message?.toString()}
        </div>
      )}
      <input
        type="password"
        className={cn(
          "py-3 px-3 rounded-md border border-bColor outline-none w-full",
          errors.confirmPassword && "border-red-500"
        )}
        placeholder="Confrim Password"
        {...register("confirmPassword")}
      />
      {errors.password && (
        <div className="text-sm text-error-500">
          {errors.password.message?.toString()}
        </div>
      )}
      <div className="w-full flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C713CB] hover:bg-[#a409a7] text-[white] h-[50px] px-10 border-none outline-none rounded-md min-w-[120px]"
        >
          {loading ? (
            <Spinner
              classNames={{
                wrapper: "w-6 h-6",
                circle1: "border-b-white",
                circle2: "border-b-white",
              }}
            />
          ) : (
            "Register"
          )}
        </button>
        <div>
          <Link
            href={"/"}
            className="hover:underline hover:text-[#C713CB] cursor-pointer"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
