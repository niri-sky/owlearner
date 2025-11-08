"use client";
// global package imports
import dynamic from "next/dynamic";
import { FaCircle } from "react-icons/fa";
import { LuArrowDownRight } from "react-icons/lu";
import { Props } from "react-apexcharts";
import { MdOutlineArrowOutward } from "react-icons/md";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type CompProps = {
  title: string;
  type: "month" | "year";
  data: {
    change: number;
    chartValue: number;
    currentText: string;
    prevText: string;
    currentEarnings: number;
  };
};

const MonthlyEarnings = ({ data, title, type }: CompProps) => {
  const chart: Props = {
    series: [data.chartValue],
    type: "radialBar",
    height: 140,
    width: 140,

    options: {
      chart: {
        height: 140,
        //   type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: false,
          },
          hollow: {
            size: "50%",
          },
        },
      },
      // labels: ["Cricket"],
    },
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex">
        <h3 className="text-[22px] font-semibold capitalize text-txt">
          {title}
        </h3>
      </div>
      <div className="flex items-start justify-between">
        <div className="w-[55%]">
          <h2 className="text-[22px] font-bold text-txt">
            ${data.currentEarnings?.toFixed(2)}
          </h2>
          <div className="flex items-center gap-3 ">
            <div>
              {isNegative(data.change) ? (
                <div className="w-[30px] h-[30px] rounded-full bg-[#FDEDE8] text-[#fa896b] text-md flex justify-center items-center hover:bg-[#fdbcaa]">
                  <LuArrowDownRight />
                </div>
              ) : (
                <div className="w-[30px] h-[30px] rounded-full bg-[#E6FFFA] text-[#13deb9] text-md flex justify-center items-center hover:bg-[#d3fff6]">
                  <MdOutlineArrowOutward />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[14px] text-txt">
              <span>
                {isNegative(data.change) ? "-" : "+"}
                {data.change}%
              </span>{" "}
              <span>last {type}</span>
            </div>
          </div>
          <div className="w-full flex justify-between items-center gap-3 mt-[20px]">
            <div className="flex items-center gap-3 text-sm">
              <div className="text-[#5d87ff] text-[12px]">
                <FaCircle />
              </div>
              <p>{data.currentText}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-[#ecf2ff] text-[12px]">
                <FaCircle />
              </div>
              <p>{data.prevText}</p>
            </div>
          </div>
        </div>
        <div className="w-[45%]">
          <ReactApexChart {...chart} />
        </div>
      </div>
    </div>
  );
};

function isNegative(number: number) {
  return number < 0;
}

export default MonthlyEarnings;
