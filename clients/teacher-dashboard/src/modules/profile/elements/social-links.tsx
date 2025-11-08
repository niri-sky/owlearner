"use client";
import React, { useState } from "react";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
// react icons
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
  FaLinkedin,
} from "react-icons/fa";
import Link from "next/link";
import * as yup from "yup";
import SelectField from "@/modules/courses-and-support/create-course/field/SelectField";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import InputField from "@/modules/courses-and-support/create-course/field/InputField";
import rswitch from "rswitch";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProfileData } from "@/shared/context/ProfileDataProvider";

const SOCIAL_TYPE_ARRAY = [
  {
    value: "facebook",
    label: "Facebook",
  },
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "twitter",
    label: "Twitter",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
  },
  {
    value: "youtube",
    label: "Youtube",
  },
];

const SOCIAL_LINKS = (type: string) =>
  rswitch(type, {
    facebook: <FaFacebookSquare />,
    instagram: <FaInstagramSquare />,
    twitter: <FaTwitterSquare />,
    linkedin: <FaLinkedin />,
  });

const formSchema = yup.object({
  links: yup.array(
    yup.object({
      type: yup.string().required(),
      link: yup.string().required(),
    })
  ),
});

type FormType = yup.InferType<typeof formSchema>;

type Props = {
  links?: any[];
};

const SocialLinks = ({ links }: Props) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      links,
    },
  });

  const { updateProfile } = useProfileData();

  // state
  const [edit, setEdit] = useState<boolean>(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
    rules: {
      maxLength: {
        value: 4,
        message: "Maximum 4",
      },
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (loading) return;
    try {
      setLoading(true);

      await updateProfile({
        links: {
          deleteMany: {},
          create: d.links?.map((v) => ({
            userType: "teacher",
            type: v.type,
            link: v.link,
          })),
        },
      });
      toast.success("Profile updated");
      setEdit(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col md:px-[30px] px-[20px] border rounded-xl bg-[white] border-[#e2e2e2]"
    >
      <div className="w-full flex justify-between items-center py-4 border-b border-[#e2e2e2]">
        <h2 className="md:text-[20px] text-lg font-semibold text-txt capitalize">
          Social Links
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
              reset({ links });
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
        <div className="">
          <div className="flex flex-col gap-5 w-full py-4">
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-5 items-center">
                <div className="w-[calc(100%-50px)]  flex gap-4">
                  <div className="w-1/2">
                    <SelectField
                      control={control}
                      items={SOCIAL_TYPE_ARRAY}
                      name={`links.${i}.type`}
                      placeholder="Select social media"
                    />
                  </div>
                  <div className="w-1/2">
                    <InputField
                      placeholder="Social media link"
                      {...register(`links.${i}.link`)}
                      errors={errors}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    className="min-w-[40px] px-0"
                    variant="light"
                    color="danger"
                    isIconOnly
                    onClick={() => {
                      remove(i);
                    }}
                  >
                    <AiOutlineDelete size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {fields.length < SOCIAL_TYPE_ARRAY.length && (
            <div>
              <Button
                onClick={() => {
                  if (fields.length < SOCIAL_TYPE_ARRAY.length) {
                    append({ link: "", type: "" });
                  }
                }}
                color="primary"
                startContent={<IoMdAddCircleOutline />}
              >
                Add More Link
              </Button>
            </div>
          )}

          <div className="pt-5"></div>
        </div>
      ) : (
        <ul className="flex flex-col sm:gap-5 gap-4 w-full py-4">
          {links && links?.length > 0 ? (
            links?.map((v, i) => (
              <li
                key={"sgd" + i}
                className="flex sm:flex-row flex-col w-full sm:items-center items-start md:gap-5 gap-2"
              >
                <div className="text-[#919191] flex items-center gap-2 text-[15px] min-w-[150px]">
                  <span>{SOCIAL_LINKS(v.type)}</span>
                  <span className="capitalize">{v.type}</span>
                </div>
                <Link
                  target="_blank"
                  href={v.link}
                  className="text-txt hover:underline hover:text-primary text-[15px]"
                >
                  {v.link}
                </Link>
              </li>
            ))
          ) : (
            <li>No links found</li>
          )}
        </ul>
      )}
    </form>
  );
};

export default SocialLinks;
