"use client";
import React from "react";
import MyCourses from "./elements/my-courses";
import ProgressInfo from "./elements/progress-info";

const Dashboard = () => {
  return (
    <div className="w-full h-full px-10 pb-10 bg-[#F8FAFC]">
      <ProgressInfo />
      <MyCourses />
    </div>
  );
};
export default Dashboard;
