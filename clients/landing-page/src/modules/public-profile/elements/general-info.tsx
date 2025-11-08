"use client";
import React, { useState } from "react";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import { formatDate } from "@/shared/utils";
import toast from "react-hot-toast";
import InputField from "@/shared/field/InputField";
import SelectField from "@/shared/field/SelectField";

const updateProfileSchema = yup.object({
  name: yup.string().required(),
  nickName: yup.string(),
  birthDate: yup.string(),
  gender: yup.string(),
  username: yup.string(),
});

type ProfileForm = yup.InferType<typeof updateProfileSchema>;

const GeneralInfo = () => {
  const { profileData, updateProfile } = useProfileData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      birthDate: profileData?.birthDate || "",
      name: profileData?.name,
      nickName: profileData?.nickName || "",
      username: profileData?.username || "",
      gender: profileData?.gender || "",
    },
  });

  // states
  const [edit, setEdit] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<ProfileForm> = async (d) => {
    if (loading) return;
    try {
      setLoading(true);

      await updateProfile(d);

      toast.success("Profile updated");

      setEdit(false);

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error("Error occurred " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col md:px-[30px] px-[20px] border rounded-xl bg-[white] border-[#e2e2e2]"
    >
      <div className="w-full flex justify-between items-center py-4 border-b border-[#e2e2e2]">
        <h2 className="md:text-[20px] text-lg font-semibold text-txt capitalize">
          General Information
        </h2>
        <div className="flex items-center gap-3">
          {edit && (
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              isIconOnly={loading}
              className="min-w-[80px]"
              radius="sm"
              startContent={loading && <Spinner size="sm" color="default" />}
            >
              {!loading && "Update"}
            </Button>
          )}
          <Button
            onClick={() => setEdit(!edit)}
            className="!text-[16px]"
            color="default"
            radius="sm"
          >
            {edit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
      {edit ? (
        <div className="flex flex-col gap-3 w-full py-4">
          <InputField
            label="Name"
            placeholder="enter name"
            {...register("name")}
            errors={errors}
          />
          <InputField
            label="Username"
            placeholder="enter username"
            {...register("username")}
            errors={errors}
          />
          <InputField
            label="Nickname"
            placeholder="enter nickname"
            {...register("nickName")}
            errors={errors}
          />
          <InputField
            label="Birth Date"
            placeholder="enter birthdate"
            type="date"
            {...register("birthDate")}
            errors={errors}
          />
          <SelectField
            label="Gender"
            control={control}
            name="gender"
            items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-5 w-full py-4">
          <li className="flex w-full items-center gap-5">
            <span className="text-[#919191] text-[15px] lg:min-w-[150px] md:min-w-[130px] sm:min-w-[120px] min-w-[80px]">
              Name
            </span>
            <span className="text-txt capitalize text-[15px]">
              {profileData?.name}
            </span>
          </li>
          <li className="flex w-full items-center gap-5">
            <span className="text-[#919191] text-[15px] lg:min-w-[150px] md:min-w-[130px] sm:min-w-[120px] min-w-[80px]">
              Username
            </span>
            <span className="text-txt capitalize text-[15px]">
              {profileData?.username}
            </span>
          </li>
          <li className="flex w-full items-center gap-5">
            <span className="text-[#919191] text-[15px] lg:min-w-[150px] md:min-w-[130px] sm:min-w-[120px] min-w-[80px]">
              Nickname
            </span>
            <span className="text-txt capitalize text-[15px]">
              {profileData?.nickName}
            </span>
          </li>
          <li className="flex w-full items-center gap-5">
            <span className="text-[#919191] text-[15px] lg:min-w-[150px] md:min-w-[130px] sm:min-w-[120px] min-w-[80px]">
              Birth Date
            </span>
            <span className="text-txt capit text-[15px]alize">
              {profileData?.birthDate && formatDate(profileData?.birthDate)}
            </span>
          </li>
          <li className="flex w-full items-center gap-5">
            <span className="text-[#919191] text-[15px] lg:min-w-[150px] md:min-w-[130px] sm:min-w-[120px] min-w-[80px]">
              Gender
            </span>
            <span className="text-txt capitalize text-[15px]">
              {profileData?.gender}
            </span>
          </li>
        </ul>
      )}
    </form>
  );
};

export default GeneralInfo;
