"use client";
import {
  Button,
  CircularProgress,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  cn,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";
import { FaCamera, FaLock, FaUserFriends } from "react-icons/fa";
import { MdEmojiEmotions, MdPublic } from "react-icons/md";
import Picker from "emoji-picker-react";
import { useOutsideClick } from "outsideclick-react";

import * as yup from "yup";
import {
  Controller,
  UseControllerProps,
  useController,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import rswitch from "rswitch";
import UploadProgress from "./UploadProgress";
import api from "@/shared/api";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { CREATE_POST, POSTS_QUERY, UPDATE_POST } from "@/graphql/queries";
import { useProfileData } from "@/shared/context/ProfileDataProvider";

const formSchema = yup.object({
  policy: yup.string().required(),
  img: yup.mixed(),
  text: yup.string().required(),
});

type FormType = yup.InferType<typeof formSchema>;

type Props = {
  data?: PostDataTypes;
  type?: "create" | "edit";
};

function CreatePostModal({ type = "create", data }: Props) {
  const { profileData } = useProfileData();

  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: data
      ? {
          img: data?.img || "",
          policy: data?.policy || "",
          text: data?.text || "",
        }
      : {
          policy: "public",
        },
  });

  const [showPicker, setShowPicker] = useState(false);

  const ref = useOutsideClick(() => setShowPicker(false));

  const { field } = useController({
    name: "img",
    control,
  });

  const imgSrc = field.value
    ? typeof field.value === "object"
      ? URL.createObjectURL(field.value)
      : field.value
    : undefined;

  const [uploadProgress, setUploadProgress] = useState<number | undefined>();

  async function filesUploader(obj: any) {
    let object: any = obj || {};
    for (let [key, value] of Object.entries(object)) {
      if (typeof value === "object") {
        object[key] = await filesUploader(value);
      }

      if (value instanceof File) {
        const fileObj: File = value;
        const formData = new FormData();
        formData.append("file", fileObj);
        const { data: dt } = await api.post("/upload/bucket", formData, {
          onUploadProgress: (pe) => {
            setUploadProgress((pe.progress || 0) * 100);
          },
        });
        object[key] = dt.location;
      }
    }
    return object;
  }

  const [loading, setLoading] = useState(false);

  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [POSTS_QUERY],
    awaitRefetchQueries: true,
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: [POSTS_QUERY],
    awaitRefetchQueries: true,
  });

  console.log(errors);

  const onSubmit = async (d: FormType) => {
    console.log("Form", d);
    if (loading) return;
    try {
      setLoading(true);

      const newD = await filesUploader(d);
      if (type == "create") {
        await createPost({
          variables: {
            input: {
              ...newD,
              userType: "teacher",
              teacher: {
                connect: {
                  id: Number(profileData?.id),
                },
              },
            },
          },
        });
      }
      if (type == "edit") {
        await updatePost({
          variables: {
            id: Number(data?.id),
            input: {
              ...newD,
            },
          },
        });
      }

      toast.success("Post " + (type == "create" ? "created" : "updated"));

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error("Error occurred " + err.message);
    }
  };

  return (
    <ModalContent>
      {(onClose) => (
        <form onSubmit={handleSubmit((d) => onSubmit(d).then(onClose))}>
          <ModalHeader className="flex flex-col gap-1 border-b border-bcolor">
            {type == "create" ? "Create" : "Edit"} a post
          </ModalHeader>
          <ModalBody>
            <div className="w-full flex flex-col gap-2 py-2">
              <div className="flex w-full items-center gap-3">
                <div>
                  <div className="w-[60px] h-[60px] rounded-full ">
                    <Image
                      className="w-full h-full rounded-full object-cover"
                      width={50}
                      height={50}
                      src={profileData?.profile || "/user-1.jpg"}
                      alt="Profile image"
                    />
                  </div>
                </div>
                <div>
                  <Controller
                    name="policy"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        onChange={onChange}
                        onBlur={onBlur}
                        startContent={rswitch(value || "public", {
                          public: <MdPublic className="text-lg" />,
                          followers: <FaUserFriends className="text-lg" />,
                          // onlyme: <FaLock />,
                        })}
                        defaultSelectedKeys={["public"]}
                        selectedKeys={value ? [value] : ["public"]}
                        className="w-[140px]"
                        aria-label="post policy"
                        isRequired
                        disallowEmptySelection
                      >
                        <SelectItem
                          key="public"
                          startContent={<MdPublic className="text-lg" />}
                          value="public"
                        >
                          Public
                        </SelectItem>
                        <SelectItem
                          key="followers"
                          startContent={<FaUserFriends className="text-lg" />}
                          value="followers"
                        >
                          Followers
                        </SelectItem>
                        {/* <SelectItem
                          key="onlyme"
                          startContent={<FaLock />}
                          value="onlyme"
                        >
                          Only Me
                        </SelectItem> */}
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="w-full">
                <textarea
                  className={cn(
                    "py-2 px-2 border border-bcolor outline-none w-full rounded-md",
                    errors.text && "border-red-500"
                  )}
                  placeholder="Share what's your mind Banna..."
                  cols={30}
                  rows={imgSrc ? 3 : 6}
                  {...register("text")}
                ></textarea>
              </div>

              {imgSrc && (
                <div className="relative">
                  <Image
                    className="w-full h-[300px] object-cover"
                    width={500}
                    height={300}
                    alt="img"
                    src={imgSrc}
                  />
                  {uploadProgress && (
                    <div className="absolute bg-gray-500 bg-opacity-60 top-0 left-0 w-full h-full flex items-center justify-center">
                      <CircularProgress
                        size="lg"
                        classNames={{
                          svg: "w-[100px] h-[100px] drop-shadow-md",
                          indicator: "stroke-white",
                          track: "stroke-white/10",
                          value: "text-2xl font-semibold text-white",
                        }}
                        value={uploadProgress}
                        showValueLabel={true}
                        strokeWidth={2}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="w-full flex items-center justify-between gap-3">
              <div className="w-full flex items-center gap-3 pb-4 px-4">
                <label htmlFor="postimg">
                  <FaCamera className="text-[20px] text-[gray] hover:text-[#3a3a3a] cursor-pointer" />
                  <input
                    className="hidden"
                    type="file"
                    name=""
                    accept="image/png, image/gif, image/jpeg"
                    id="postimg"
                    onChange={(e) => {
                      const f = e.target?.files?.[0];
                      if (f) {
                        field.onChange(f);
                      }
                    }}
                    onClick={(e) => (e.currentTarget.value = "")}
                    onBlur={field.onBlur}
                  />
                </label>
                <div ref={ref} className="relative">
                  <div onClick={() => setShowPicker((s) => !s)}>
                    <MdEmojiEmotions className="text-[22px] text-[gray] hover:text-[#3a3a3a] cursor-pointer" />
                  </div>
                  {showPicker && (
                    <div className="absolute bottom-0 left-[22px]">
                      <Picker
                        searchDisabled
                        style={{ height: 300 }}
                        previewConfig={{ showPreview: false }}
                        onEmojiClick={(e) => {
                          setValue("text", watch("text") + e.emoji);
                          setShowPicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button
                color="primary"
                type="submit"
                disabled={loading}
                isIconOnly={loading}
                className="min-w-[80px]"
                radius="sm"
                startContent={loading && <Spinner size="sm" color="default" />}
              >
                {!loading && (type == "create" ? "Post" : "Update")}
              </Button>
            </div>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}

export default CreatePostModal;
