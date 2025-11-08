import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useState } from "react";
import { SubmitHandler, useForm, useController } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import * as yup from "yup";
import Picker from "emoji-picker-react";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import api from "@/shared/api";
import { useOutsideClick } from "outsideclick-react";
import { cn } from "@/shared/utils";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import { IoIosCloseCircle, IoIosCloseCircleOutline } from "react-icons/io";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT, POSTS_QUERY, UPDATE_COMMENT } from "@/graphql/queries";

const formSchema = yup.lazy((values) => {
  if (!values.img && !values.message) {
    return yup.object().shape({
      img: yup.mixed().required("Either image or message is required"),
      message: yup.string().required("Either image or message is required"),
    });
  }

  return yup.object({
    img: values.img ? yup.mixed() : yup.mixed().notRequired(),
    message: values.message ? yup.string() : yup.string().notRequired(),
  });
});

type Props = {
  postData?: PostDataTypes;
  data?: CommentType;
  type?: "create" | "edit" | "reply";
  onCancel?: () => any;
  commentId?: string | number;
};

type FormType = yup.InferType<typeof formSchema>;

const CommentFiled = ({
  data,
  type = "create",
  onCancel,
  postData,
  commentId,
}: Props) => {
  const { profileData } = useProfileData();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormType>({
    resolver: yupResolver(formSchema),
    defaultValues: data
      ? {
          img: data?.img || "",
          message: data?.message || "",
        }
      : {
          message: "",
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
        setUploadProgress(undefined);
        object[key] = dt.location;
      }
    }
    return object;
  }

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [POSTS_QUERY],
    awaitRefetchQueries: true,
  });

  const [updateComment] = useMutation(UPDATE_COMMENT, {
    refetchQueries: [POSTS_QUERY],
    awaitRefetchQueries: true,
  });

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormType> = async (d) => {
    if (loading) return;
    try {
      setLoading(true);

      const newD = await filesUploader(d);

      if (type == "create") {
        await createComment({
          variables: {
            input: {
              ...newD,
              userType: "teacher",
              teacher: {
                connect: {
                  id: Number(profileData?.id),
                },
              },
              post: {
                connect: {
                  id: Number(postData?.id),
                },
              },
            },
          },
        });
        reset();
      }

      if (type == "edit") {
        await updateComment({
          variables: {
            id: Number(data?.id),
            input: newD,
          },
        });
        onCancel?.();
        reset();
      }

      if (type == "reply") {
        await updateComment({
          variables: {
            id: Number(commentId),
            input: {
              replies: {
                create: {
                  ...newD,
                  userType: "teacher",
                  teacher: {
                    connect: {
                      id: Number(profileData?.id),
                    },
                  },
                },
              },
            },
          },
        });
        onCancel?.();
        reset();
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error("Error occurred " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex justify-between items-start gap-3"
    >
      {type != "edit" && (
        <div className="w-auto">
          <div className="md:w-[38px] w-[33px] md:h-[38px] h-[33px] ">
            <Image
              className="w-full h-full rounded-full object-cover"
              width={38}
              height={38}
              src={profileData?.profile || "/user-1.jpg"}
              alt="Profile image"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between gap-5 w-[calc(100%-40px)]">
        <div className="flex flex-col w-full gap-2">
          <div className="text-[15px] flex flex-col items-start gap-2">
            <div
              className={cn(
                "md:py-3 bg-white py-2 w-full md:px-3 px-2 rounded-md border border-[#c9c9c9] ",
                errors.message && "border-red-500"
              )}
            >
              {imgSrc && (
                <div className="pb-2  w-fit">
                  <div className="relative">
                    <Image
                      className=" object-cover"
                      width={100}
                      height={80}
                      alt="img"
                      src={imgSrc}
                    />
                    <div
                      onClick={() => {
                        setValue("img", "");
                      }}
                      className="absolute cursor-pointer bg-white rounded-full z-10 -top-3 -right-3"
                    >
                      <IoIosCloseCircle size={24} color="#ef4444" />
                    </div>
                    {uploadProgress && (
                      <div className="absolute bg-gray-200 bg-opacity-40 top-0 left-0 w-full h-full flex items-center justify-center">
                        <CircularProgress
                          size="lg"
                          value={uploadProgress}
                          showValueLabel={false}
                          strokeWidth={20}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              <textarea
                className="outline-none w-full"
                placeholder="enter comment here"
                {...register("message")}
              ></textarea>
            </div>
            <div className="w-full flex items-center gap-3">
              <label htmlFor="postimg">
                <FaCamera className="text-[20px] text-[gray] hover:text-[#3a3a3a] cursor-pointer" />
                <input
                  className="hidden"
                  type="file"
                  name=""
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
                        setValue("message", watch("message") + e.emoji);
                        setShowPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm flex items-center gap-3 mt-2 text-[gray] cursor-pointer">
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              isIconOnly={loading}
              className="min-w-[80px]"
              radius="sm"
              startContent={loading && <Spinner size="sm" color="default" />}
            >
              {!loading && (type == "edit" ? "Update" : "Post")}
            </Button>
            <Button
              onClick={onCancel}
              radius="sm"
              color="danger"
              variant="light"
            >
              Cancel
            </Button>
            {uploadProgress && <div>Uploading image...</div>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentFiled;
