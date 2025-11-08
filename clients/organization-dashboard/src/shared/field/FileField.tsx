import _ from "lodash";
import { InputHTMLAttributes, ReactNode } from "react";
import {
  FieldErrors,
  UseControllerProps,
  useController,
} from "react-hook-form";

type FileFieldProps = {
  label: string;
  labelComponent?: ReactNode;
  errors?: FieldErrors;
  onNewChange?: (f: File) => void;
} & InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<any>;

function FileField({
  label,
  className,
  labelComponent,
  errors,
  onNewChange,
  ...props
}: FileFieldProps) {
  const labelStyle =
    "font-semibold text-[14px]  flex items-center gap-3 leading-[19.07px]  text-[#101010] inline-block";
  const inputStyle =
    "outline-[#E0E0E0] w-[100%] focus:outline-none h-[48px] text-[#6D6D6D] bg-[#F8F8F8] text-[14px] font-medium border border-[#E0E0E0] rounded-[6px] mt-[10px] px-[20px] py-3 ";

  const error = _.get(errors, props.name || "");

  const { field } = useController(props);

  return (
    <>
      <div className="flex flex-col w-full">
        <label className={`${labelStyle}`} htmlFor={props.name}>
          {label} {labelComponent}
        </label>

        <div className={`${inputStyle} ${className} items-center flex gap-2`}>
          <label className="text-primary flex items-center bg-[#F2EBF9] hover:bg-primary hover:text-[#fff] transition-all duration-200 font-medium cursor-pointer px-2 h-full rounded-[4px]">
            <input
              id={props.name}
              {...props}
              className="hidden"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  field.onChange(file);
                  onNewChange && onNewChange(file);
                }
              }}
            />
            Choose File
          </label>

          <div className="  w-[calc(100%-120px)] overflow-hidden line-clamp-1">
            {field.value
              ? typeof field.value === "string"
                ? field.value
                : field.value?.name
              : "No file chosen"}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-1">
            {error?.message?.toString()}
          </div>
        )}
      </div>
    </>
  );
}

export default FileField;
