import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useStudentData } from "@/shared/context/StudentDataProvider";

const DashboardCourseCard = () => {
  const { profileData } = useStudentData();

  const courses = profileData?.courses;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {courses?.map((v, i) => (
        <div
          key={"sdgs" + i}
          className="flex flex-col break-words  shrink-0 justify-between rounded-xl border-l-4 border-primary p-4 bg-white shadow-md"
        >
          <div className="flex flex-col overflow-hidden">
            <Image
              src={v?.course?.thumbnail || "/course-image.png"}
              width={500}
              height={400}
              alt="random"
              className="w-full h-[200px] pb-3 object-cover"
            />
            {/* course title */}
            <p className="font-medium tracking-wide text-slate-700 line-clamp-2 dark:text-navy-100">
              {v?.course?.title}
            </p>
          </div>
          {/* footer area */}
          <div className="mt-2 flex items-center justify-between text-primary dark:text-accent-light">
            <p className="font-medium">Advanced</p>
            <Link href={`/dashboard/course/${v?.course?.slug}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
export default DashboardCourseCard;
