import api from "@/shared/api";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { cn, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";

type Props = {
  cover?: string;
};

function UploadCoverImage({ cover }: Props) {
  const [file, setFile] = useState<File | string | undefined>(cover);

  const { updateProfile } = useProfileData();

  useEffect(() => {
    setFile(cover);
  }, [cover]);

  const imgSrc = file
    ? typeof file === "object"
      ? URL.createObjectURL(file)
      : file
    : "/images/cover-image.jpg";

  const { isOpen, onOpenChange } = useDisclosure();

  const saveChanges = async (f: File) => {
    onOpenChange();
    const formData = new FormData();
    formData.append("file", f);
    const { data: dt } = await api.post("/upload/bucket", formData, {});
    await updateProfile({ cover: dt.location });
  };

  return (
    <div>
      <div className="w-full h-[225px] group overflow-hidden relative">
        <Image
          className="object-cover w-full h-full 2xl:w-full 2xl:h-full"
          width={1000}
          height={225}
          src={imgSrc}
          alt="Cover image"
        />
        <div
          className={cn(
            "absolute hidden top-[10px] left-0 w-full  items-center justify-between gap-5 px-4",
            typeof file == "object" ? "!flex" : "group-hover:flex"
          )}
        >
          <div>
            <input
              className="hidden"
              type="file"
              name=""
              accept="image/png, image/gif, image/jpeg"
              id="coverimg"
              onChange={(e) => {
                const f = e.target?.files?.[0];
                if (f) {
                  setFile(f);
                  onOpenChange();
                }
              }}
              onClick={(e) => (e.currentTarget.value = "")}
            />
            <label
              htmlFor="coverimg"
              className="w-[30px] flex justify-center items-center h-[30px] bg-[white] text-[gray] hover:text-[#525252] cursor-pointer rounded-md"
            >
              <FaCamera />
            </label>
          </div>
          {isOpen && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setFile(cover);
                  onOpenChange();
                }}
                className="py-2 px-5 rounded-md bg-[white] hover:bg-[#dfdfdf] text-[black] capitalize border-none outline-none text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.promise(saveChanges(file as any), {
                    error: "Something went wrong",
                    loading: "Uploading...",
                    success: "Cover image updated",
                  });
                }}
                className="py-2 px-5 rounded-md bg-[white] text-[black] hover:bg-[#dfdfdf] capitalize border-none outline-none text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadCoverImage;
