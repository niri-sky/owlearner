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
type Props = {
  data: {
    date: string;
    count: number;
  }[];
};

const OrganizationsAnalytics = ({ data }: Props) => {
  return (
    <div className="w-full flex flex-col gap-4 mt-3">
      <div className="w-full flex flex-col">
        <h2 className="text-txt font-semibold text-[18px] capitalize">
          Organizations Analytics
        </h2>
        <p className="text-txt text-sm">Last 12 month Analytics data</p>
      </div>
      <div className="w-full shadow-sm border border-bcolor py-3 rounded-md">
        <ResponsiveContainer width={"100%"} height={350}>
          <AreaChart
            id="area-chart-4"
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fill="#5d87ff"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrganizationsAnalytics;
