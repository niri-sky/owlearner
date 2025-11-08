import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IoApps } from "react-icons/io5";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
//

const WeeklyStats = () => {
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   if (!isClient) {
  //     setIsClient(true);
  //   }
  // }, [isClient]);

  const chart: any = {
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 150,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  };
  // if (!isClient) null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-[20px] font-semibold capitalize text-txt">
          Weekly Stats
        </h3>
        <p className="text-[15px] text-txt">Average sales</p>
      </div>
      <div>
        <ReactApexChart
          options={chart.options}
          series={chart.series}
          type="area"
          height={150}
          width={"100%"}
        />
      </div>
      {/*  */}
      <div className="flex flex-col gap-[25px] w-full">
        {/*  */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#ECF2FF] text-[#5d87ff] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">Top Sales</h2>
              <p className="text-txt text-[14px]">Johnathan Doe</p>
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#ECF2FF] text-[#5d87ff] flex justify-center items-center text-sm">
            +68
          </div>
        </div>
        {/*  */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#E8F7FF] text-[#49beff] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">
                Best Seller
              </h2>
              <p className="text-txt text-[14px]">Footware</p>
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#E8F7FF] text-[#49beff] flex justify-center items-center text-sm">
            +45
          </div>
        </div>
        {/*  */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#FDEDE8] text-[#fa896b] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">
                Most Courses
              </h2>
              <p className="text-txt text-[14px]">Fashionware</p>
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#FDEDE8] text-[#fa896b] flex justify-center items-center text-sm">
            +14
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyStats;
