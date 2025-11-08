"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan 20, 2022",
    uv: 80,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Feb 20, 2022",
    uv: 210,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Mar 20, 2022",
    uv: 70,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Apr 20, 2022",
    uv: 50,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "may 3, 2022",
    uv: 20,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Jun 20, 2022",
    uv: 90,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Jul 3, 2022",
    uv: 290,
    pv: 4300,
    amt: 2100,
  },
];

const TeachersAnalytics = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col">
        <h2 className="text-txt font-semibold text-[18px] capitalize">
          Teachers Analytics
        </h2>
        <p className="text-txt text-sm">Last 12 month Analytics data</p>
      </div>
      <div className="w-full shadow-sm border border-bcolor py-3 rounded-md">
        <ResponsiveContainer width={"100%"} height={350}>
          <AreaChart
            id="area-chart-2"
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#5d87ff"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeachersAnalytics;
