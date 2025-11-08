import React from "react";
import CourseTimeline from "../features/course-timeline";
import CourseProgressCard from "../features/course-progress-card";

const ProgressInfo = () => {
  return (
    <div className="flex flex-col px-10">
      <div className="mt-4 grid grid-cols-12 gap-4 transition-all duration-[.25s] sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <CourseTimeline />
        <CourseProgressCard />
      </div>
    </div>
  );
};
export default ProgressInfo;
