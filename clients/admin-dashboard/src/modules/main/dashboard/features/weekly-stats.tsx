import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { IoApps } from "react-icons/io5";
import { calculateLast8MonthsEarnings } from "@/shared/utils/analytics";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
//

type Props = {
  sales: AnalyticsSales[];
  paymentInvoices: PaymentInvoiceType[];
  courses: CourseDataTypes[];
  teachers: TeacherTypes[];
  organizations: OrganizationTypes[];
};

const WeeklyStats = ({
  sales,
  paymentInvoices,
  courses,
  teachers,
  organizations,
}: Props) => {
  const { monthData } = useMemo(() => {
    const monthData = calculateLast8MonthsEarnings(sales, paymentInvoices);

    return { monthData };
  }, [sales, paymentInvoices]);

  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   if (!isClient) {
  //     setIsClient(true);
  //   }
  // }, [isClient]);

  const chart: any = {
    series: [
      {
        name: "Desktops",
        data: monthData.map((v) => v.sales),
      },
    ],
    options: {
      chart: {
        height: 150,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: monthData.map((v) => v.shortMonth),
      },
    },
  };
  // if (!isClient) null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-[20px] font-semibold capitalize text-txt">Stats</h3>
        <p className="text-[15px] text-txt">Average sales</p>
      </div>
      <div>
        <ReactApexChart
          options={chart.options}
          series={chart.series}
          type="area"
          height={150}
          width={"100%"}
        />
      </div>
      {/*  */}
      <div className="flex flex-col gap-[25px] w-full">
        {/*  */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#ECF2FF] text-[#5d87ff] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">
                Total Sales
              </h2>
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#ECF2FF] text-[#5d87ff] flex justify-center items-center text-sm">
            {sales.length}
          </div>
        </div>
        {/*  */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#E8F7FF] text-[#49beff] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">
                Total Courses
              </h2>
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#E8F7FF] text-[#49beff] flex justify-center items-center text-sm">
            {courses.length}
          </div>
        </div>
        {/*  */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#FDEDE8] text-[#fa896b] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">
                Total Teachers
              </h2>
              {/* <p className="text-txt text-[14px]">Fashionware</p> */}
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#FDEDE8] text-[#fa896b] flex justify-center items-center text-sm">
            {teachers.length}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#fde8fa] text-[#fa6bee] flex justify-center items-center text-lg">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-txt">
                Total Organizations
              </h2>
              {/* <p className="text-txt text-[14px]">Fashionware</p> */}
            </div>
          </div>
          <div className="w-[42px] h-[30px] rounded-md bg-[#fde8f8] text-[#fa6bee] flex justify-center items-center text-sm">
            {organizations.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyStats;
