"use client";
import React, { useMemo } from "react";
import CoursePreview from "./CoursePreview";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { SINGLE_COURSES_QUERY } from "@/graphql/queries";
import AdminLayout from "@/shared/components/admin-layout";

function CourseDetails() {
  const params = useParams();

  const { data, loading } = useQuery(SINGLE_COURSES_QUERY, {
    variables: {
      slug: params.slug,
    },
    skip: !params.slug,
  });

  const courseData = data?.course;

  if (loading) return <></>;

  return (
    <AdminLayout>
      <div className="container">
        <div className="pt-[20px]"></div>
        <CoursePreview data={courseData} />
        <div className="pt-[80px]"></div>
      </div>
    </AdminLayout>
  );
}

export default CourseDetails;
