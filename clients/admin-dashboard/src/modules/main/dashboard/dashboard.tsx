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
  COURSES_QUERY,
  ORGANIZATIONS_QUERY,
  PAYMENT_INVOICES_QUERY,
  SALES_QUERY,
  TEACHERS_QUERY,
  TOP_STUDENTS_QUERY,
} from "@/graphql/queries";
import CurrentAndPrev from "./features/current-and-prev";

const Dashboard = () => {
  const { data } = useQuery(SALES_QUERY);

  const { data: topStudentsData } = useQuery(TOP_STUDENTS_QUERY);

  const { data: paymentInvoicesData } = useQuery(PAYMENT_INVOICES_QUERY, {
    variables: {
      where: {
        to: {
          equals: "admin",
        },
      },
    },
  });

  const { data: coursesData } = useQuery(COURSES_QUERY);

  const { data: teachersData } = useQuery(TEACHERS_QUERY);

  const { data: organizationsData } = useQuery(ORGANIZATIONS_QUERY);

  const salesData = data?.sales || [];
  const paymentInvoices = paymentInvoicesData?.paymentInvoices || [];

  const topStudents = topStudentsData?.topStudents || [];

  const courses = coursesData?.courses || [];

  const teachers = teachersData?.teachers || [];
  const organizations = organizationsData?.organizations || [];

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
            <Statistics sales={salesData} paymentInvoices={paymentInvoices} />
          </div>
          <div className="flex w-full flex-col lg:flex-row xl:flex-col gap-5 xl:w-[30%]">
            <CurrentAndPrev sales={salesData} />
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="shadow-sm w-full rounded-md p-5 border-bcolor border lg:w-[40%] xl:w-[30%]">
            <WeeklyStats
              organizations={organizations}
              teachers={teachers}
              courses={courses}
              sales={salesData}
              paymentInvoices={paymentInvoices}
            />
          </div>
          <div className="lg:w-[60%] xl:w-[70%] w-full shadow-sm rounded-md p-5 border border-bcolor">
            <TopStudents data={topStudents} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
