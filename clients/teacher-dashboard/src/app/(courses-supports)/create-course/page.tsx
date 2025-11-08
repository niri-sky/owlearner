import CreateCourseComponent from "@/modules/courses-and-support/create-course/CreateCourseComponent";
import AdminLayout from "@/shared/components/admin-layout";
import React from "react";

function CreateCoursePage() {
  return (
    <AdminLayout>
      <CreateCourseComponent />
    </AdminLayout>
  );
}

export default CreateCoursePage;
