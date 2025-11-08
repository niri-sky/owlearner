import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestCourses = ({
  latestCourseImg,
  latestCourseTitle,
}: LatestCoursesDataTypes) => {
  return (
    <Link
      href="/profile"
      className="flex items-start gap-2 w-full cursor-pointer"
    >
      <div>
        <div className="w-[40px]">
          <Image
            className="w-full h-full rounded-full object-cover"
            width={30}
            height={30}
            src={latestCourseImg}
            alt={latestCourseTitle}
          />
        </div>
      </div>

      <div className="overflow-hidden">
        <p className="text-[14px] text-[gray] hover:underline hover:text-[#474747]">
          {latestCourseTitle}
        </p>
      </div>
    </Link>
  );
};

export default LatestCourses;
