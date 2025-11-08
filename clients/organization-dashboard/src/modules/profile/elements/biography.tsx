"use client";
import React, { useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useProfileData } from "@/shared/context/ProfileDataProvider";

const formSchema = yup.object({
  biography: yup.string(),
});

type FormType = yup.InferType<typeof formSchema>;

type Props = {
  biography?: string;
};

const Biography = ({ biography }: Props) => {
  const { updateProfile } = useProfileData();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      biography,
    },
  });

  // states
  const [edit, setEdit] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (loading) return;
    try {
      setLoading(true);

      await updateProfile(d);

      setLoading(false);

      toast.success("Biography updated");
      setEdit(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col md:px-[30px] px-[20px] border rounded-xl bg-[white] border-[#e2e2e2]"
    >
      <div className="w-full flex justify-between items-center py-4 border-b border-[#e2e2e2]">
        <h2 className="md:text-[20px] text-lg font-semibold text-txt capitalize">
          Biography
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
            onClick={() => {
              setEdit(!edit);
            }}
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
          <div>
            <textarea
              className="py-3 px-3 rounded-md border border-[#e2e2e2] outline-none w-full"
              placeholder="Write biography here.."
              cols={30}
              rows={6}
              {...register("biography")}
            ></textarea>
            {errors.biography && (
              <div className="text-red-500 text-sm ">
                {errors.biography.message?.toString()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <ul className="flex gap-5 w-full py-4">
          <li className="flex md:flex-row flex-col w-full md:items-center items-start md:gap-5 gap-3">
            <span className="text-[#919191] text-[15px] min-w-[150px]">
              Biography
            </span>
            <span className="text-txt capitalize text-[15px]">{biography}</span>
          </li>
        </ul>
      )}
    </form>
  );
};

export default Biography;
