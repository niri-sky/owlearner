"use client";
// global package imports
import dynamic from "next/dynamic";
import { FaCircle } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import { Props } from "react-apexcharts";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const chart: Props = {
  series: [70],
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

type CompProps = {};

const YearlyBreakup = ({}: CompProps) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex">
        <h3 className="text-[22px] font-semibold capitalize text-txt">
          Yearly Breakup
        </h3>
      </div>
      <div className="flex items-start justify-between">
        <div className="w-[55%]">
          <h2 className="text-[22px] font-bold text-txt">$36,358</h2>
          <div className="flex items-center gap-3 mt-[10px]">
            <div>
              <div className="w-[30px] h-[30px] rounded-full bg-[#E6FFFA] text-[#13deb9] text-md flex justify-center items-center hover:bg-[#d3fff6]">
                <MdOutlineArrowOutward />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[14px] text-txt">
              <span>+9%</span> <span>last year</span>
            </div>
          </div>
          <div className="w-full flex justify-between items-center gap-3 mt-[30px]">
            <div className="flex items-center gap-3 text-sm">
              <div className="text-[#5d87ff] text-[12px]">
                <FaCircle />
              </div>
              <p>2023</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-[#ecf2ff] text-[12px]">
                <FaCircle />
              </div>
              <p>2022</p>
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

export default YearlyBreakup;
