"use client";

// import pakages

// custom import files
import AdminLayout from "@/shared/components/admin-layout";
import { dashboardReportBoxDatas } from "@/app/configs/constants";
import DashboardReportBox from "./features/dashboard-report-box";
import Statistics from "./features/statistics";
import YearlyBreakup from "./features/yearly-breakup";
import MonthlyEarnings from "./features/monthly-earnings";
import WeeklyStats from "./features/weekly-stats";
import TopStudents from "./features/top-students";
import { useQuery } from "@apollo/client";
import {
  SALES_QUERY,
  TEACHER_EARNING,
  TOP_STUDENTS_QUERY,
} from "@/graphql/queries";
import { useMemo } from "react";
import CurrentAndPrev from "./features/current-and-prev";
import useUserData from "@/shared/hooks/useUserData";

const Dashboard = () => {
  const { userData } = useUserData();

  const { data } = useQuery(TEACHER_EARNING, {
    variables: {
      teacherId: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const { data: topStudentsData } = useQuery(TOP_STUDENTS_QUERY, {
    variables: {
      where: {
        courses: {
          some: {
            course: {
              is: {
                teacherId: {
                  equals: Number(userData?.id),
                },
              },
            },
          },
        },
      },
    },
  });

  const topStudents = topStudentsData?.topStudents || [];

  const salesData = data?.teacherEarning?.sales || [];

  const withdraw = data?.teacherEarning?.withdraw || 0;

  console.log(topStudents, "Top Student Data");

  return (
    <AdminLayout>
      <div className="flex flex-col w-full gap-5">
        {/* <div className="flex items-center gap-5 w-full"> */}
        {/* {dashboardReportBoxDatas.map(
            (
              {
                bgColor,
                count,
                heading,
                Icon,
                iconColor,
                textColor,
              }: DashboardReportBoxDataTypes,
              i: number
            ) => (
              <DashboardReportBox
                bgColor={bgColor}
                count={count}
                heading={heading}
                Icon={Icon}
                iconColor={iconColor}
                textColor={textColor}
                key={i}
              />
            )
          )} */}
        {/* </div> */}
        {/*  */}
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="w-full xl:w-[70%] shadow-sm rounded-md p-5 border border-bcolor">
            <Statistics sales={salesData} withdraw={withdraw} />
          </div>
          <div className="flex w-full flex-col lg:flex-row xl:flex-col gap-5 xl:w-[30%]">
            <CurrentAndPrev sales={salesData} />
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className=" w-full shadow-sm rounded-md p-5 border border-bcolor">
            <TopStudents data={topStudents} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
