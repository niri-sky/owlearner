"use client";
// global packages
import Image from "next/image";
// custom files import
import AdminLayout from "@/shared/components/admin-layout";
import { Button, Spinner, cn } from "@nextui-org/react";
import UploadProfileImage from "./UploadProfileImage";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useMemo, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_ADMIN_PROFILE } from "@/graphql/queries";
import toast from "react-hot-toast";

const updateAdminSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  profile: yup.mixed().nullable(),
  currentPassword: yup.string(),

  newPassword: yup.string(),
  confirmPassword: yup.string(),
});

type UpdateAdmin = {
  id?: string;
  name: string;
  email: string;
  profile?: any;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const AccountSettings = () => {
  const { data, update } = useSession();

  const [updateAdminProfile] = useMutation(UPDATE_ADMIN_PROFILE, {
    onCompleted: async (d) => {
      await update({ user: d.updateAdminProfile });
    },
    onError: (error) => {},
  });

  console.log("Session Data", data);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateAdmin>({
    resolver: yupResolver(updateAdminSchema),
    values: data?.user as any,
  });

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<UpdateAdmin> = async (d) => {
    if (d.currentPassword) {
      if (!d.newPassword) {
        return setError("newPassword", {
          message: "Enter new password to change password",
        });
      }
      if (!d.confirmPassword) {
        return setError("confirmPassword", {
          message: "Enter confirm password ",
        });
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
          d.newPassword
        )
      ) {
        return setError("newPassword", {
          message:
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
        });
      }

      if (d.currentPassword.length < 8) {
        return setError("currentPassword", {
          message: "Must be at least 8 characters",
        });
      }
      if (d.confirmPassword.length < 8) {
        return setError("confirmPassword", {
          message: "Must be at least 8 characters",
        });
      }
      if (d.newPassword.length < 8) {
        return setError("newPassword", {
          message: "Must be at least 8 characters",
        });
      }

      if (d.newPassword != d.confirmPassword) {
        return setError("confirmPassword", {
          message: "Password not match",
        });
      }
      if (d.currentPassword == d.newPassword) {
        return setError("newPassword", {
          message: "Password should not be old",
        });
      }
    }
    if (loading) return;
    try {
      setLoading(true);

      const res = await updateAdminProfile({
        variables: {
          id: Number(d?.id),
          input: {
            name: d.name,
            currentPassword: d.currentPassword,
            newPassword: d.newPassword,
          },
        },
      });

      reset();

      toast.success("Admin Updated");
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Account Setting
          </h2>
          <div className="absolute top-[20px] right-[19px]">
            <Image
              width={165}
              height={100}
              src={
                "https://modernize-angular-main.netlify.app/assets/images/breadcrumb/ChatBc.png"
              }
              alt="employee image"
            />
          </div>
        </div>
        {/* form start */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-5 w-full flex-col justify-between"
        >
          <div className="flex flex-col lg:flex-row gap-5 w-full justify-between">
            {/* left side */}
            <div className="w-full shadow-sm border border-bcolor p-3 rounded-[12px] flex flex-col gap-5 self-start">
              <div className="w-full flex flex-col pb-4 px-2">
                <h2 className="text-[18px] font-semibold text-txt">
                  Change Profile
                </h2>
                <p className="text-txt text-sm">
                  Change your profile picture from here
                </p>
              </div>
              <UploadProfileImage
                userData={data?.user as any}
                updateAdminProfile={updateAdminProfile}
              />
              <div className="w-full text-center pb-1">
                <p className="text-txt text-sm">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </div>
            {/* right side */}
            <div className="w-full flex flex-col gap-5">
              {/* input name and email fields */}
              <div className="w-full shadow-sm border border-bcolor pt-[12px] pb-[22px] px-5 rounded-[12px] flex flex-col gap-4">
                <div className="w-full flex flex-col pb-2 px-2">
                  <h2 className="text-[18px] font-semibold text-txt">
                    Personal Details
                  </h2>
                  <p className="text-txt text-sm">
                    To change your personal detail , edit and save from here
                  </p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Your Name
                  </label>
                  <input
                    className={cn(
                      "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
                      errors.name && "!border-red-500"
                    )}
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <div className="text-sm text-red-500">
                      {errors.name.message?.toString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Email
                  </label>
                  <input
                    className={cn(
                      "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
                      errors.email && "!border-red-500"
                    )}
                    type="email"
                    placeholder="Email"
                    readOnly
                    {...register("email")}
                  />
                  {errors.email && (
                    <div className="text-sm text-red-500">
                      {errors.email.message?.toString()}
                    </div>
                  )}
                </div>
              </div>
              {/* input Password fields */}
              <div className="w-full shadow-sm border border-bcolor pt-[12px] pb-[22px] px-5 rounded-[12px] flex flex-col gap-4">
                <div className="w-full flex flex-col pb-2 px-2">
                  <h2 className="text-[18px] font-semibold text-txt">
                    Change Password
                  </h2>
                  <p className="text-txt text-sm">
                    To change your password please confirm here
                  </p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Current Password
                  </label>
                  <input
                    className={cn(
                      "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
                      errors.currentPassword && "!border-red-500"
                    )}
                    type="password"
                    placeholder="Current Password"
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <div className="text-sm text-red-500">
                      {errors.currentPassword.message?.toString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    New Password
                  </label>
                  <input
                    className={cn(
                      "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
                      errors.newPassword && "!border-red-500"
                    )}
                    type="password"
                    placeholder="New Password"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <div className="text-sm text-red-500">
                      {errors.newPassword.message?.toString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Confirm Password
                  </label>
                  <input
                    className={cn(
                      "md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]",
                      errors.confirmPassword && "!border-red-500"
                    )}
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <div className="text-sm text-red-500">
                      {errors.confirmPassword.message?.toString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* save and cancel buttons */}
          <div className="flex gap-3 w-full justify-end items-center pb-4">
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              isIconOnly={loading}
              className="min-w-[100px] disabled:opacity-75"
              startContent={loading && <Spinner size="sm" color="default" />}
            >
              {!loading && "Update"}
            </Button>

            <Button color="danger" variant="bordered">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AccountSettings;
