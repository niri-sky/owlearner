import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import {
  Button,
  CircularProgress,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "./cropimage";
import UploadProgress from "./elements/UploadProgress";
import api from "@/shared/api";
import toast from "react-hot-toast";
import { useProfileData } from "@/shared/context/ProfileDataProvider";

type Props = {
  profile?: string;
};

function UploadProfileImage({ profile }: Props) {
  const [file, setFile] = useState<File | string | undefined>(profile);

  useEffect(() => {
    setFile(profile);
  }, [profile]);

  const imgSrc = file
    ? typeof file === "object"
      ? URL.createObjectURL(file)
      : file
    : "https://modernize-angular-main.netlify.app/assets/images/profile/user-1.jpg";

  return (
    <>
      <div className=" relative group">
        <div className="lg:w-[200px] md:w-[180px] w-[130px] lg:h-[200px] md:h-[180px] h-[130px] rounded-full ">
          <Image
            className="rounded-full lg:w-[200px] md:w-[180px] w-[130px] lg:h-[200px] md:h-[180px] h-[130px] border-2 border-[white]"
            width={200}
            height={200}
            src={imgSrc}
            alt=""
          />
        </div>

        <input
          className="hidden"
          type="file"
          name=""
          accept="image/png, image/gif, image/jpeg"
          id="profileImg"
          onChange={(e) => {
            const f = e.target?.files?.[0];
            if (f) {
              setFile(f);
            }
          }}
          onClick={(e) => (e.currentTarget.value = "")}
        />

        <label
          htmlFor="profileImg"
          className="w-full h-full absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] rounded-full justify-center items-center bg-[#00000079] text-[20px] hidden group-hover:flex"
        >
          <span className="w-[40px] rounded-full flex justify-center items-center bg-[white] h-[40px] group cursor-pointer">
            <FaCamera className="text-[18px] text-txt group-hover:text-[#40ade3]" />
          </span>
        </label>
      </div>
      <Modal
        isOpen={file != null && typeof file == "object"}
        size="lg"
        onClose={() => setFile((f) => (typeof f == "object" ? profile : f))}
      >
        <ProfileImageCrop imgSrc={imgSrc} />
      </Modal>
    </>
  );
}

type CropProps = {
  imgSrc: string;
};

function ProfileImageCrop({ imgSrc }: CropProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const { updateProfile } = useProfileData();

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const [loading, setLoading] = useState(false);

  const [uploadProgress, setUploadProgess] = useState<number | undefined>();

  const croppedImage = async () => {
    if (!croppedAreaPixels || loading) return;
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels, 0);
      if (!croppedImage) return;
      const formData = new FormData();
      formData.append("file", croppedImage);
      const { data: dt } = await api.post("/upload/bucket", formData, {
        onUploadProgress: (pe) => {
          setUploadProgess((pe.progress || 0) * 100);
        },
      });
      await updateProfile({ profile: dt.location });

      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      toast.error("Error Occurred " + e.message);
    }
  };

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Update Profile
          </ModalHeader>
          <ModalBody>
            <div className="h-[350px] relative">
              <Cropper
                image={imgSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 4}
                onCropChange={setCrop}
                onCropComplete={(c, ca) => setCroppedAreaPixels(ca)}
                onZoomChange={setZoom}
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
            {/* <UploadProgress progress={uploadProgress} /> */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={loading}
              isIconOnly={loading}
              className="min-w-[80px]"
              startContent={loading && <Spinner size="sm" color="default" />}
              onPress={() => {
                croppedImage().then(onClose);
              }}
            >
              {!loading && "Update"}
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}

export default UploadProfileImage;
