import React from "react";
import { CircularProgress as CircularProgressBar } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                              circular progress                             */
/* -------------------------------------------------------------------------- */
export default function CircularProgress({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <>
      <div className="relative w-[150px] h-[150px] flex justify-center items-center flex-col">
        <CircularProgressBar
          value={value}
          color="primary"
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-primary",
            track: "stroke-primary/10",
            value: "text-base font-semibold",
          }}
          className="circle-progress"
          strokeWidth={10}
          aria-labelledby="circular progress"
          showValueLabel
        />
        <p className="absolute top-[55%] text-xs font-semibold">{label}</p>
      </div>
    </>
  );
}
