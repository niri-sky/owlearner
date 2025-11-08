import OneFingerSign from "@/shared/assets/icons/OneFingerSign";
import React, { useMemo } from "react";
import CircularChart from "../features/circular-chart";

/* -------------------------------------------------------------------------- */
/*                             quiz report summary                            */
/* -------------------------------------------------------------------------- */

type Props = {
  data: {
    totalQuiz: number;
    perticipate: number;
    totalQues: number;
    numberObtained: number;
  };
};

const QuizReportSummary = ({ data }: Props) => {
  const avarage = useMemo(() => {
    return (data.numberObtained / data.totalQues) * 100;
  }, [data]);

  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-lg border bg-white px-2 py-4 text-center shadow sm:p-6">
      <h1 className="subtitle capitalize font-semibold">Quiz Report Summary</h1>
      <div className="flex flex-col md:flex-row h-full items-center justify-between md:gap-4">
        {/* left side calculation */}
        <div className="flex flex-col gap-2 py-6">
          {/* participation */}
          <div className="flex gap-2">
            <OneFingerSign />
            <div className="flex items-center gap-2 text-1 text-xs md:text-sm">
              <p>Participation</p>
              <p>-</p>
              <p className="font-semibold">
                {data.perticipate} / {data.totalQuiz}
              </p>
            </div>
          </div>
          {/* number obtained */}
          <div className="flex gap-2">
            <OneFingerSign />
            <div className="flex items-center gap-2 text-1 text-xs md:text-sm">
              <p>Number obtained</p>
              <p>-</p>
              <p className="font-semibold">
                {data.numberObtained} / {data.totalQues}
              </p>
            </div>
          </div>
          {/* correct answer */}
          <div className="flex gap-2">
            <OneFingerSign />
            <div className="flex items-center gap-2 text-1 text-xs md:text-sm">
              <p>Correct answer</p>
              <p>-</p>
              <p className="font-semibold">
                {data.numberObtained} / {data.totalQues}
              </p>
            </div>
          </div>
        </div>
        {/* right side graph */}
        <CircularChart label="Average marks" value={avarage} />
      </div>
    </div>
  );
};
export default QuizReportSummary;
