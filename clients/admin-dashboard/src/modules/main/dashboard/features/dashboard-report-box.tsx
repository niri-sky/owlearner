"use client";
import Image from "next/image";
import React from "react";
import cls from "classnames";

const DashboardReportBox = ({
  bgColor,
  textColor,
  Icon,
  heading,
  count,
  iconColor,
}: any) => {
  return (
    <div
      className={cls(
        "flex flex-col px-8 py-8 rounded-md w-full justify-center items-start",
        bgColor
      )}
    >
      <div className="w-full pb-2">
        <span
          className={cls(
            iconColor,
            "flex justify-start items-start text-[40px]"
          )}
        >
          <Icon />
        </span>
      </div>
      <div>
        <h4 className={cls(textColor, "text-[22px]")}>{heading}</h4>
      </div>
      <div>
        <h6 className={cls("font-semibold text-xl", textColor)}>{count}</h6>
      </div>
    </div>
  );
};

export default DashboardReportBox;
