import { Select, SelectItem } from "@nextui-org/react";
import _ from "lodash";
import React from "react";
import { Control, Controller, useFormState } from "react-hook-form";

type ItemsType = {
  value: any;
  label: string;
};

type Props = {
  name: string;
  items: ItemsType[];
  control: Control<any>;
  label?: string;
  placeholder?: string;
  startContent?: React.ReactNode;
};

function SelectField({
  control,
  items,
  name,
  label,
  placeholder,
  startContent,
}: Props) {
  const { errors } = useFormState({ control });

  const error = _.get(errors, name || "");

  return (
    <div>
      {label && (
        <label
          className="font-semibold text-[14px] block  leading-[19.07px]   capitalize text-[#444444]  mb-[10px]"
          htmlFor={"course"}
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            items={items}
            label={placeholder || "select item"}
            size="sm"
            onChange={onChange}
            onBlur={onBlur}
            selectedKeys={value ? [value] : []}
            startContent={startContent}
            classNames={{
              trigger: "bg-[#F8F8F8] border border-[#E5DDED]",
            }}
          >
            {(val) => (
              <SelectItem key={val.value} value={val.value}>
                {val.label}
              </SelectItem>
            )}
          </Select>
        )}
      />
      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error?.message?.toString()}
        </div>
      )}
    </div>
  );
}

export default SelectField;
