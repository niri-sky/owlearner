"use client";
import { useStudentData } from "@/shared/context/StudentDataProvider";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { Props } from "react-apexcharts";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CourseTimeline = () => {
  const { profileData } = useStudentData();

  const completedCourses = useMemo(() => {
    const studentCourses = profileData?.courses || [];

    return studentCourses.filter((v) => v.completedAt != undefined);
  }, [profileData]);

  const chart: Props = {
    type: "rangeBar",
    width: "100%",
    height: "200",
    series: [
      {
        data: [
          ...completedCourses.map((v) => ({
            x: v.course.title,
            y: [
              new Date(v.createdAt).getTime(),
              new Date(v.completedAt || "").getTime(),
            ],
          })),
        ],
      },
    ],
    options: {
      chart: {
        height: "150",
      },

      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        show: false,
      },
    },
  };
  return (
    <div className="bg-[white] shadow-md flex flex-col rounded-[0.5rem] relative break-words col-span-12 pb-3 lg:col-span-6">
      <div className="mt-3 flex h-8 items-center justify-between px-4 sm:px-5">
        <h2 className="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
          Courses Timeline
        </h2>
      </div>
      <div id="chart">
        <ReactApexChart {...chart} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default CourseTimeline;
