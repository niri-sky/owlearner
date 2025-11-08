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
import useUserData from "@/shared/hooks/useUserData";
import { useQuery } from "@apollo/client";
import {
  COURSES_QUERY,
  ORGANIZATIONS_QUERY,
  ORGANIZATION_EARNING,
  PAYMENT_INVOICES_QUERY,
  TEACHERS_QUERY,
  TOP_STUDENTS_QUERY,
} from "@/graphql/queries";
import { useMemo } from "react";
import CurrentAndPrev from "./features/current-and-prev";

const Dashboard = () => {
  const { userData } = useUserData();

  const { data } = useQuery(ORGANIZATION_EARNING, {
    variables: {
      organizationId: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const { salesData, withdraw } = useMemo(() => {
    const organizationEarning = data?.organizationEarning;

    const teacherEarnings: AnalyticsTeacherEarning[] =
      organizationEarning?.teachersEarnings || [];

    const salesData = teacherEarnings?.flatMap((v) => v.sales) || [];

    const withdraw = organizationEarning?.withdraw;

    return { salesData, withdraw };
  }, [data]);

  console.log(salesData, "Sales");

  const { data: paymentInvoicesData } = useQuery(PAYMENT_INVOICES_QUERY, {
    variables: {
      where: {
        organizationId: { equals: Number(userData?.id) },
        to: {
          equals: "admin",
        },
      },
    },
  });

  const { data: topStudentsData } = useQuery(TOP_STUDENTS_QUERY, {
    variables: {
      where: {
        courses: {
          some: {
            course: {
              is: {
                teacher: {
                  is: {
                    organizationId: {
                      equals: Number(userData?.id),
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    skip: !userData?.id,
  });

  const { data: coursesData } = useQuery(COURSES_QUERY, {
    variables: {
      where: {
        teacher: {
          is: {
            organizationId: {
              equals: Number(userData?.id),
            },
          },
        },
      },
    },
  });

  const { data: teachersData } = useQuery(TEACHERS_QUERY, {
    variables: {
      where: {
        organizationId: {
          equals: Number(userData?.id),
        },
      },
    },
  });

  const paymentInvoices = paymentInvoicesData?.paymentInvoices || [];

  const topStudents = topStudentsData?.topStudents || [];

  const courses = coursesData?.courses || [];

  const teachers = teachersData?.teachers || [];

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
            <Statistics
              paymentInvoices={paymentInvoices}
              sales={salesData}
              withdraw={withdraw}
            />
          </div>
          <div className="flex w-full flex-col lg:flex-row xl:flex-col gap-5 xl:w-[30%]">
            <CurrentAndPrev sales={salesData} />
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="shadow-sm w-full rounded-md p-5 border-bcolor border lg:w-[40%] xl:w-[30%]">
            <WeeklyStats
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
