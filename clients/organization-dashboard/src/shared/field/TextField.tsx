"use client";
import _ from "lodash";
import dynamic from "next/dynamic";
import { ComponentType, ReactNode, useEffect, useState } from "react";
import {
  FieldErrors,
  UseControllerProps,
  useController,
} from "react-hook-form";
import ReactQuill from "react-quill";
// const QuillNoSSRWrapper = dynamic(import("react-quill"), {
//   ssr: false,
// });

// import QuillNoSSRWrapper from "react-quill";

const QuillNoSSRWrapper: ComponentType<ReactQuill.ReactQuillProps> = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  }
);

type TextFieldProps = {
  label: string;
  errors?: FieldErrors;
  isScrollEnabled?: boolean;
} & UseControllerProps<any>;

function TextField({
  label,
  errors,
  isScrollEnabled,
  ...props
}: TextFieldProps) {
  const { field } = useController(props);

  const labelStyle =
    "font-semibold text-[14px] flex items-center justify-between leading-[19.07px] text-[#444444] inline-block";

  const error = _.get(errors, props.name || "");
  return (
    <div className="w-full">
      <label className={`${labelStyle}`} htmlFor={props.name}>
        {label}
      </label>
      <div className="mt-[10px] min-h-[48px] w-[100%] relative">
        <QuillNoSSRWrapper
          onChange={(e) => {
            field.onChange(e);
          }}
          value={field.value as string}
          theme="snow"
          className="text-[14px] leading-[160%] border border-[#E5DDED] rounded-[12px] bg-[#F8F8F8] text-primary-text font-medium"
          placeholder="Type here..."
          defaultValue={props.defaultValue as string}
        />
      </div>
      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error?.message?.toString()}
        </div>
      )}
    </div>
  );
}

export default TextField;
