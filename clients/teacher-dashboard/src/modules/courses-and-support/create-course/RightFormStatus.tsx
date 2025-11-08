import { cn } from "@/shared/utils";
import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { rswitch } from "rswitch";

export type FormStatusType = "information" | "options" | "content" | "preview";

const statusData = {
  information: "Course Information",
  options: "Course Options",
  content: "Course Content",
  preview: "Course Preview",
};

type Props = { status: FormStatusType };

function RightFormStatus({ status }: Props) {
  return (
    <div>
      <ul className="multi-steps">
        {Object.entries(statusData).map(([key, value], i) => (
          <li key={"dgh" + i} className={cn(key == status && "is-active")}>
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RightFormStatus;
