"use client";
import React from "react";
import RightBar from "./RightBar";
import VideoSection from "./VideoSection";
import { sampleCourseData } from "../data";
import CourseAccessProvider from "@/shared/context/CourseAccessProvider";
import { useMutation, useQuery } from "@apollo/client";
import { SINGLE_COURSES_QUERY, UPDATE_COURSE } from "@/graphql/queries";
import { useParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";

function CourseAccess() {
  const params = useParams();

  const { data, loading } = useQuery(SINGLE_COURSES_QUERY, {
    variables: {
      slug: params.slug,
    },
    skip: !params.slug,
  });

  const courseData = data?.course;

  if (loading)
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-4">
          <Spinner />
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );

  return (
    <CourseAccessProvider data={courseData}>
      <div className="container">
        <div className="pt-[32px] lg:pt-[110px]"></div>
        <div className="flex flex-col  lg:flex-row-reverse gap-[28px] ">
          <div className="hidden lg:block lg:w-[424px]">
            <RightBar />
          </div>
          <div className="lg:w-[calc(100%-452px)]">
            <VideoSection />
          </div>
        </div>
        <div className="pt-[80px]"></div>
      </div>
    </CourseAccessProvider>
  );
}

export default CourseAccess;
