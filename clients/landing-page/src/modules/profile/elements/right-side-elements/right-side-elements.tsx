import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import LatestCourses from "../latest-courses";
import { Props } from "react-apexcharts";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const chart: Props = {
  series: [76],
  options: {
    chart: {
      type: "radialBar",
      offsetY: -20,

      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#999",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "16px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      type: "gradient",

      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ["Average Results"],
  },
};

const RightSideElements = () => {
  // state
  const [isFixed, setIsFixed] = useState(false);

  // scroll to fixed right sidebar elements
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 200;

      if (scrollY >= scrollThreshold) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`xl:w-[23%] w-full self-start xl:flex hidden flex-col gap-5 top-0 ${
        isFixed
          ? "sticky xl:fixed xl:w-[22%] xl:right-[30px] xl:top-[10px]"
          : null
      }`}
    >
      {/* Your existing div content */}
      {/* <div className="w-full border border-[#e2e2e2] rounded-md p-[10px]">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-[16px] font-medium capitalize">
            Complete your profile
          </h2>
          <ReactApexChart type="radialBar" {...chart} />
        </div>
      </div> */}
      <div className="w-full border border-[#e2e2e2] rounded-md p-[10px]">
        {/* <div className="w-full flex flex-col gap-2">
          <h2 className="text-[16px] font-medium">Latest courses</h2>
          {coursesData.map(
            (
              { latestCourseImg, latestCourseTitle }: LatestCoursesDataTypes,
              i: number
            ) => (
              <LatestCourses
                latestCourseImg={latestCourseImg}
                latestCourseTitle={latestCourseTitle}
                key={i}
              />
            )
          )}
        </div> */}
      </div>
    </div>
  );
};

export default RightSideElements;
