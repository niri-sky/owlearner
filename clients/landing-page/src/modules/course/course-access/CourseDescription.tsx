import { useCouseAccessData } from "@/shared/context/CourseAccessProvider";
import React from "react";

function CourseDescription() {
  const { data } = useCouseAccessData();

  return (
    <>
      <div className="pt-6"></div>
      <div
        className="unreset text-[#4E5566]"
        dangerouslySetInnerHTML={{ __html: data?.description }}
      ></div>
    </>
  );
}

export default CourseDescription;
