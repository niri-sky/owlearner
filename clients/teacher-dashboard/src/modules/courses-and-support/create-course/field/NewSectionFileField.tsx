"use client";
import cx from "classnames";
import _ from "lodash";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  FieldErrors,
  UseControllerProps,
  useController,
} from "react-hook-form";
export const isBrowser = typeof window !== "undefined";
type FUFProps = {
  errors?: FieldErrors;
  label?: string;
} & UseControllerProps<any>;
const NewSectionFileField = ({ errors, label, ...props }: FUFProps) => {
  const { field } = useController(props);

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    console.log(file);
    field.onChange(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "image/png": [
          ".png",
          ".svg",
          ".mp4",
          ".webm",
          ".ogg",
          ".mov",
          ".avi",
          ".gif",
          ".flv",
          ".jpg",
          ".jpeg",
        ],
      },
      maxFiles: 1,
    });

  const imgSrc = useMemo(() => {
    return typeof field.value === "string"
      ? field.value
      : isBrowser
      ? field.value instanceof File
        ? URL.createObjectURL(field.value)
        : ""
      : "";
  }, [field.value]);

  const error = _.get(errors, props.name || "");

  const isVideoFile = isVideo(imgSrc) || field?.value?.type?.includes("video");

  const labelStyle =
    "font-semibold text-[14px]  flex items-center gap-3 justify-between leading-[19.07px]   capitalize text-[#444444] inline-block mb-[10px]";
  return (
    <>
      {label && (
        <label className={`${labelStyle}`} htmlFor={props.name}>
          {label}
        </label>
      )}
      <div
        className={cx(
          "w-full h-full   min-h-[168px] flex items-center justify-center rounded-[8px] ",
          !imgSrc && "border border-dashed border-[#CEBDDE]",
          error && "!border-red-500"
        )}
      >
        <div
          {...getRootProps({
            className: `dropzone h-fit flex item-center justify-center ${
              isDragActive ? "active" : ""
            }`,
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col">
            <div
              className={cx(
                "px-[12px]   items-center justify-center py-[18px] flex flex-col gap-[9px]",
                imgSrc && "border border-dashed rounded-[8px] border-[#CEBDDE]"
              )}
            >
              {imgSrc ? (
                <>
                  {isVideoFile ? (
                    <video
                      src={imgSrc}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      controls
                    ></video>
                  ) : (
                    <Image
                      width={500}
                      height={400}
                      src={imgSrc}
                      alt="Preview"
                      className="w-full "
                    />
                  )}
                </>
              ) : (
                <>
                  <Image
                    className="mx-auto"
                    src="/images/uploadFile.svg"
                    alt="upload"
                    width={24}
                    height={24}
                  ></Image>
                  <p className="font-normal text-center text-[13px] leading-[15px] text-secondary-text">
                    Drag & drop files or{" "}
                    <span className="text-primary font-bold cursor-pointer underline">
                      Browse
                    </span>
                  </p>
                  <p className="text-primary-text font-normal text-[10px] leading-[12px] text-center">
                    Supported formats: Image
                  </p>
                </>
              )}
            </div>
            {imgSrc && (
              <div>
                <div className="pt-4"></div>
                <div className="text-center ">
                  <button
                    type="button"
                    className="text-primary hover:bg-primary hover:text-[#fff] transition-all duration-200 h-[33px] w-[90px] border border-primary rounded-[6px] font-semibold leading-[17px] text-sm "
                  >
                    Replace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error?.message?.toString()}
        </div>
      )}
    </>
  );
};

export default NewSectionFileField;

export function getExtension(filename: string) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}

export function isVideo(filename: string) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "m4v":
    case "avi":
    case "mpg":
    case "mp4":
    case "webm":
    case "flv":
      return true;
  }
  return false;
}
