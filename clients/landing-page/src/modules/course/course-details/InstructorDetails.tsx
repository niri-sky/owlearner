import React, { useMemo } from "react";
import RatingStar from "../RatingStar";
import Enrolled from "./icons/Enrolled";
import Image from "next/image";

type Props = {
  data?: CourseData;
};

function InstructorDetails({ data }: Props) {
  const { teacherData, totalRating, totalStudents, courses } = useMemo(() => {
    const teacherData = data?.teacher;

    let totalReview = 0;
    let reviewCount = 0;

    const courses = teacherData?.courses;

    courses?.forEach((v) => {
      v.reviews.forEach((r) => {
        totalReview += r.rating;
        reviewCount++;
      });
    });

    const totalStudents = courses?.flatMap((v) => v.studentCourse);

    return {
      teacherData,
      totalRating: totalReview / reviewCount,
      totalStudents,
      courses,
    };
  }, [data]);

  return (
    <>
      <div className="pt-[40px]"></div>
      <div>
        <div>
          <div className="text-[24px] font-playfair text-[#1D2026] leading-[32px] font-semibold">
            Course instructor
          </div>
          <div className="pt-5"></div>
          <div className="border flex-col md:flex-row flex gap-[10px] lg:gap-6 border-[#E9EAF0] p-4 lg:p-[32px] ">
            <div className="max-lg:w-[60px] lg:w-[136px]">
              <Image
                src={teacherData?.profile || "/user-1.jpg"}
                alt="test"
                height={136}
                width={136}
                className="rounded-full max-lg:w-[60px] max-lg:h-[60px]"
              />
            </div>
            <div className="md:w-[calc(100%-70px)] lg:w-[calc(100%-150px)]">
              <div className="text-[20px] font-semibold leading-[26px] font-playfair text-[#1D2026] ">
                {teacherData?.name}
              </div>
              <div className="pt-[6px]"></div>
              <div className="text-sm leading-[22px] font-dmsans text-[#6E7485]">
                {teacherData?.title}
              </div>
              <div className="pt-[16px]"></div>
              <div className="flex max-lg:flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex gap-[6px] items-center font-dmsans text-[#4E5566] text-sm leading-[20px]">
                  <RatingStar rating={totalRating || 0} />
                  <span className="font-medium text-[#1D2026]">
                    {(totalRating || 0).toFixed(1)}
                  </span>
                  Course Rating
                </div>
                <div className="flex gap-[6px] items-center font-dmsans text-[#4E5566] text-sm leading-[20px]">
                  <Enrolled stroke="#564FFD" width={20} height={20} />
                  <span className="font-medium text-[#1D2026]">
                    {totalStudents?.length || 0}
                  </span>
                  Students
                </div>
                <div className="flex gap-[6px] items-center font-dmsans text-[#4E5566] text-sm leading-[20px]">
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                      fill="#C713CB"
                      stroke="#C713CB"
                      strokeWidth="1.5"
                      strokeMiterlimit={10}
                    />
                    <path
                      d="M12.5 10L8.75 7.5V12.5L12.5 10Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-medium text-[#1D2026]">
                    {courses?.length || 0}
                  </span>
                  Courses
                </div>
              </div>
              <div className="pt-[16px]"></div>

              <div className="text-sm leading-[22px] text-[#6E7485]">
                {teacherData?.biography}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InstructorDetails;
