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
import Image from "next/image";
import VerifyImg from "./verified.svg";
import Link from "next/link";

const Confirmation: React.FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col justify-center items-center gap-3 h-screen">
      <div className="flex flex-col md:gap-[25px] sm:gap-[15px] gap-3 sm:w-[450px] w-[95%]  mx-auto md:py-[60px] md:px-[40px] py-[40px] sm:px-[25px] px-[20px] shadow-md rounded-md bg-[white] border border-bcolor">
        <div className="w-full text-center ">
          <h2 className="md:text-2xl text-2xl font-semibold text-gray-800">
            Email has been Verified
          </h2>
        </div>
        <div className=" flex justify-center">
          <Image height={100} width={100} src={VerifyImg} alt="" />
        </div>
        <div>
          <div className="text-center">
            Your account approval is pending. An email will be sent to notify
            you once it&apos;s approved.
          </div>
        </div>

        <div className="w-full">
          <Link href={"/signin"}>
            <button
              className={`w-full rounded-md py-3 px-5 border-none outline-none  hover:bg-[#5280ff] text-[white] capitalize flex items-center gap-2 justify-center ${"bg-[#5d87ff]"}`}
            >
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
