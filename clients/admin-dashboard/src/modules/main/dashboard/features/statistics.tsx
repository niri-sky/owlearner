"use client";

import { generateCsv } from "@/shared/utils";
import {
  calculateLast8MonthsEarnings,
  calculateTotalEarnings,
} from "@/shared/utils/analytics";
// global package imports
import { Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { IoApps } from "react-icons/io5";
import DashboardChart from "./dashboard-chart";

const dates = [
  {
    label: "March 2023",
  },
  {
    label: "April 2023",
  },
  {
    label: "July 2023",
  },
];

type Props = {
  sales: AnalyticsSales[];
  paymentInvoices: PaymentInvoiceType[];
};

const Statistics = ({ sales, paymentInvoices }: Props) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { totalEarnings, chartData, selectData } = useMemo(() => {
    const totalEarnings = calculateTotalEarnings(sales);

    const chartData = calculateLast8MonthsEarnings(sales, paymentInvoices);

    const selectData = [...chartData]
      .map((v) => ({ label: `${v.month} ${v.year}`, value: v.month }))
      .reverse();
    setSelectedMonth(selectData[0].value);

    return { totalEarnings, chartData, selectData };
  }, [sales, paymentInvoices]);

  const { monthData } = useMemo(() => {
    const monthData = chartData.find((v) => v.month == selectedMonth);

    return {
      monthData,
    };
  }, [selectedMonth, chartData]);

  console.log(selectedMonth, "Selected Month");

  const handleDownloadReport = () => {
    const test = [
      { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
      { firstname: "Raed", email: "rl@smthing.co.com", lastname: "Labes" },
      { email: "ymin@cocococo.com", fullName: "Yezzi yo" },
    ];

    generateCsv(test);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center gap-5">
        <div className="flex flex-col">
          <h3 className="text-[20px] font-semibold capitalize text-txt">
            Statistics
          </h3>
          <p className="text-[15px] text-txt">Overview of Profit</p>
        </div>
        <div className="w-[180px] !rounded-md">
          <Select
            radius="sm"
            className="w-full !py-0 "
            selectedKeys={[selectedMonth]}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
            }}
          >
            {selectData.map((items, i) => (
              <SelectItem key={items.value} value={items.label}>
                {items.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <div className="lg:w-[calc(100%-250px)]">
          <DashboardChart data={chartData} />
        </div>
        <div className="flex w-[220px] flex-col gap-[25px] ">
          {/*  */}
          <div className="flex items-center  gap-7">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[#ECF2FF] text-[#5d87ff] flex justify-center items-center text-xl">
                <IoApps />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[22px] font-bold text-txt">
                ${totalEarnings.toFixed(2)}
              </h2>
              <p className="text-txt text-[15px]">Total Earnings</p>
            </div>
          </div>
          {/*  */}
          <div className="flex items-center  gap-7">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bgwhite] text-[#5d87ff] flex justify-center items-center text-[12px]">
                <FaCircle />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-txt text-[15px]">Earnings this month</p>
              <h2 className="text-xl font-bold text-txt">
                ${monthData?.earn ? monthData.earn.toFixed(2) : 0}
              </h2>
            </div>
          </div>
          {/*  */}
          <div className="flex items-center  gap-7">
            <div>
              <div className="w-[40px] h-[40px] rounded-md bg-[white] text-[#49beff] flex justify-center items-center text-[12px]">
                <FaCircle />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-txt text-[15px]">Expenses this month</p>
              <h2 className="text-xl font-bold text-txt">
                ${monthData?.expense ? monthData?.expense.toFixed(2) : 0}
              </h2>
            </div>
          </div>
          <div className="w-[180px] ml-auto text-center">
            <Button
              onClick={handleDownloadReport}
              fullWidth
              radius="sm"
              color="primary"
            >
              ViewFull Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
