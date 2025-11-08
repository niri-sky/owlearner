import OneFingerSign from "@/shared/assets/icons/OneFingerSign";
import React from "react";
import CircularChart from "../features/circular-chart";

type Props = {
  data: any;
};

const AssignmentReportSummary = ({ data }: Props) => {
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-lg border bg-white px-2 py-4 text-center shadow sm:p-6">
      <h1 className="subtitle capitalize font-semibold">
        Assignment Report Summary
      </h1>
      <div className="flex h-full items-center justify-between gap-4">
        {/* left side calculation */}
        <div className="flex flex-col gap-2 py-6">
          {/* participation */}
          <div className="flex gap-2">
            <OneFingerSign />
            <div className="flex items-center gap-2 text-1 text-xs md:text-sm">
              <p>Participation</p>
              <p>-</p>
              <p className="font-semibold">10 / 52</p>
            </div>
          </div>
          {/* number obtained */}
          <div className="flex gap-2">
            <OneFingerSign />
            <div className="flex items-center gap-2 text-1 text-xs md:text-sm">
              <p>Timely deposits</p>
              <p>-</p>
              <p className="font-semibold">10 / 52</p>
            </div>
          </div>
          {/* correct answer */}
          <div className="flex gap-2">
            <OneFingerSign />
            <div className="flex items-center gap-2 text-1 text-xs md:text-sm">
              <p>Marks obtained</p>
              <p>-</p>
              <p className="font-semibold">10 / 52</p>
            </div>
          </div>
        </div>
        {/* right side graph */}
        <CircularChart label="Average marks" value={70} />
      </div>
    </div>
  );
};
export default AssignmentReportSummary;
