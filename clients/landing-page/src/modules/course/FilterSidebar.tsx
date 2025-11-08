"use client";
import React, { ReactNode, useMemo, useState } from "react";

import { Radio, RadioGroup, Slider, cn } from "@nextui-org/react";
import { ReducerType } from ".";

type Props = {
  categories: string[];
  tags: string[];
  filter: ReducerType[0];
  dispatch: ReducerType[1];
};

function FilterSidebar({ categories, tags, dispatch, filter }: Props) {
  const priceFilters = [
    { label: "Under $30", min: 0, max: 29.99 },
    { label: "$30 - $50", min: 30, max: 49.99 },
    { label: "$50 - $70", min: 50, max: 69.99 },
    { label: "$70 - $90", min: 70, max: 89.99 },
    { label: "$90 and above", min: 90, max: 99999 },
    { label: "Custom Range", min: 0, max: 99999 },
  ];

  const [customRange, setCustomRange] = useState(false);

  return (
    <div className=" bg-[#fff] shadow-[0px_0px_80px_0px_#CDCDCD40]">
      <div className="px-[32px] lg:px-4 p-4">
        {/* // category section  */}
        <div>
          <div className="font-playfair text-[20px] leading-[28px] text-[#191C1F] font-semibold">
            Category
          </div>
          <div className="pt-4"></div>

          <div className="flex flex-col gap-3">
            <RadioGroup classNames={{ wrapper: "gap-3" }}>
              {categories.map((v, i) => (
                <div key={"gdh" + i}>
                  <Radio
                    classNames={{
                      label:
                        "text-sm text-[#24222C] font-medium leading-[20px] ",
                    }}
                    value={v}
                    aria-label={v}
                  >
                    {v}
                  </Radio>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <hr className="bg-[#E4E7E9] my-[24px]" />
        <div>
          <div className="font-playfair text-[20px] leading-[28px] text-[#191C1F] font-semibold">
            Price Range
          </div>
          {/* <div className="mt-4"></div>
          <div>
            <Slider
              size="sm"
              step={50}
              minValue={0}
              maxValue={1000}
              defaultValue={[100, 500]}
              formatOptions={{ style: "currency", currency: "USD" }}
              aria-label="Currency"
            />
          </div> */}
          <div className="mt-4"></div>

          <div className="flex flex-col gap-3">
            <RadioGroup>
              {priceFilters.map((v, i) => (
                <div key={"gdh" + i}>
                  <Radio
                    onClick={() => {
                      if (v.label == "Custom Range") {
                        setCustomRange(true);
                      } else {
                        setCustomRange(false);
                      }
                      dispatch({
                        type: "price",
                        value: { min: v.min, max: v.max },
                      });
                    }}
                    value={"buenos-aires_" + i}
                    aria-label={v.label}
                  >
                    {v.label}
                  </Radio>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="mt-4"></div>
          {customRange && (
            <div className="grid grid-cols-2 gap-[12px]">
              <FilterInput
                placeholder="Min price"
                type="number"
                value={filter.price.min}
                onChange={(e) => {
                  dispatch({ type: "price.min", value: e.target.value });
                }}
              />
              <FilterInput
                placeholder="Max price"
                type="number"
                value={filter.price.max}
                onChange={(e) => {
                  dispatch({ type: "price.max", value: e.target.value });
                }}
              />
            </div>
          )}
        </div>
        <hr className="bg-[#E4E7E9] my-[24px]" />

        <div>
          <div className="font-playfair text-[20px] leading-[28px] text-[#191C1F] font-semibold">
            Organigation
          </div>
          <div className="pt-4"></div>
          <div>
            <FilterInput
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-3 left-[18px]"
                >
                  <path
                    d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z"
                    stroke="#1D2026"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.4431 16.4438L20.9994 21.0002"
                    stroke="#1D2026"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              className="h-[48px] pl-[54px]"
              placeholder="Oracle"
              value={filter.organization}
              onChange={(e) => {
                dispatch({ type: "organization", value: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="mt-6"></div>
        <div>
          <div className="font-playfair text-[20px] leading-[28px] text-[#191C1F] font-semibold">
            Teacher
          </div>
          <div className="pt-4"></div>
          <div>
            <FilterInput
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-3 left-[18px]"
                >
                  <path
                    d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z"
                    stroke="#1D2026"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.4431 16.4438L20.9994 21.0002"
                    stroke="#1D2026"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              className="h-[48px] pl-[54px]"
              placeholder="Erina"
              value={filter.teacher}
              onChange={(e) => {
                dispatch({ type: "teacher", value: e.target.value });
              }}
            />
          </div>
        </div>
        <hr className="bg-[#E4E7E9] my-[24px]" />
        <div>
          <div className="font-playfair text-[20px] leading-[28px] text-[#191C1F] font-semibold">
            Popular Tags
          </div>
          <div className="pt-4"></div>
          <div className="flex items-center flex-wrap gap-2">
            {tags.map((v, i) => (
              <div
                aria-selected={filter.tags.includes(v)}
                key={"gdf" + i}
                className="text-[#605F5F] cursor-pointer text-sm leading-[20px] font-dmsans font-medium p-[6px_12px] border aria-selected:border-primary aria-checked:text-primary aria-selected:bg-[#C713CB14]  border-[#E4E7E9]"
                onClick={() => {
                  if (filter.tags.includes(v)) {
                    const filterTags = [...filter.tags].filter((f) => f != v);
                    dispatch({ type: "tags", value: filterTags });
                  } else {
                    dispatch({
                      type: "tags",
                      value: [...filter.tags].concat(v),
                    });
                  }
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  startContent?: ReactNode;
};

function FilterInput({ startContent, ...props }: InputProps) {
  return (
    <div className="w-full relative">
      {startContent}
      <input
        type="text"
        {...props}
        className={cn(
          "bg-[#fff] w-full focus:outline-none border border-[#E4E7E9] h-10  px-[12px] font-dmsans font-normal text-sm leading-[24px] text-[#797979]",
          props.className
        )}
      />
    </div>
  );
}

export default FilterSidebar;
