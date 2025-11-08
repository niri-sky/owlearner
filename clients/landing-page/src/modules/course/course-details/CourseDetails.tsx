"use client";
import React, { useMemo } from "react";
import CoursePreview from "../CoursePreview";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { SINGLE_COURSES_QUERY } from "@/graphql/queries";

function CourseDetails() {
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
      <>
        <div className="w-full h-[90vh] flex items-center justify-center">
          <div className="loader"></div>
        </div>
      </>
    );

  return (
    <div>
      <div className="container">
        <div className="md:pt-[110px] pt-10"></div>
        <CoursePreview data={courseData} />
        <div className="pt-[80px]"></div>
      </div>
    </div>
  );
}

export default CourseDetails;
