"use client";
import AdminLayout from "@/shared/components/admin-layout";
import Image from "next/image";
import OrderAnalytics from "./elements/order-analytics";
import TeachersAnalytics from "./elements/teachers-analytics";
import SutdentsAnalytics from "./elements/sutdents-analytics";
import OrganizationsAnalytics from "./elements/organizations-analytics";
import { useQuery } from "@apollo/client";
import {
  COURSES_QUERY,
  ORGANIZATIONS_QUERY,
  SALES_QUERY,
  STUDENTS_QUERY,
  TEACHERS_QUERY,
} from "@/graphql/queries";
import { useMemo } from "react";
import { getLast12MonthsEarnings } from "@/shared/utils/analytics";

const AnalyticsOrganizations = () => {
  const { data: salesData } = useQuery(SALES_QUERY);

  const { data: coursesData } = useQuery(COURSES_QUERY);

  const { data: studentsData } = useQuery(STUDENTS_QUERY);

  const { data: teachersData } = useQuery(TEACHERS_QUERY);

  const { data: organizationsData } = useQuery(ORGANIZATIONS_QUERY);

  const courses = coursesData?.courses || [];

  const { chartData } = useMemo(() => {
    const sales = salesData?.sales || [];
    const teachers = teachersData?.teachers || [];
    const organizations = organizationsData?.organizations || [];
    const students = studentsData?.students || [];

    const chartData = getLast12MonthsEarnings(
      sales,
      teachers,
      organizations,
      students
    );

    return {
      chartData,
    };
  }, [salesData, teachersData, organizationsData, studentsData]);

  console.log(chartData);

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-8">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Analytics
          </h2>
          <div className="absolute top-[20px] right-[19px]">
            <Image
              width={165}
              height={100}
              src={
                "https://modernize-angular-main.netlify.app/assets/images/breadcrumb/ChatBc.png"
              }
              alt="employee image"
            />
          </div>
        </div>
        {/* charts start */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OrderAnalytics data={chartData["sales"]} />
          <TeachersAnalytics data={chartData["teachers"]} />
          <SutdentsAnalytics data={chartData["students"]} />
          <OrganizationsAnalytics data={chartData["organizations"]} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsOrganizations;
