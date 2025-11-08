"use client";
import React, { useState } from "react";
import { UseControllerProps, useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Spinner, cn } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const loginSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required().min(8),
});

type FormType = {
  email: string;
  password: string;
};

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (d: FormType) => {
    if (loading) return;
    try {
      setLoading(true);

      const result = await signIn("student-auth", {
        redirect: false,
        ...d,
      });

      if (!result?.ok) throw new Error(result?.error || "");
      const callbackUrl = searchParams.get("callback");
      router.push(callbackUrl ? callbackUrl : "/dashboard");
      toast.success("Login successfull");

      // setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error("Error occured: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4"
    >
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
            "Login"
          )}
        </button>
        <div>
          <Link
            className="hover:underline hover:text-[#C713CB]"
            href="/auth/password/forgot"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
