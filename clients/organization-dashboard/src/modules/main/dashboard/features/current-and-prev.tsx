import { calculateCurrentAndPrevious } from "@/shared/utils/analytics";
import { useMemo } from "react";
import MonthlyEarnings from "./monthly-earnings";

type Props = {
  sales: AnalyticsSales[];
};

function CurrentAndPrev({ sales }: Props) {
  const { monthlyData, yearlyData } = useMemo(() => {
    const {
      currentMonthEarnings,
      monthlyEarningsChange,
      percentageOfTotalCurrentMonth,
      currentMonthText,
      previousMonthText,
      currentYearEarnings,
      yearlyEarningsChange,
      percentageOfTotalCurrentYear,
      currentYearText,
      previousYearText,
    } = calculateCurrentAndPrevious(sales);

    const monthlyData = {
      change: Math.round(monthlyEarningsChange),
      chartValue: percentageOfTotalCurrentMonth || 0,
      currentText: currentMonthText,
      prevText: previousMonthText,
      currentEarnings: currentMonthEarnings,
    };

    const yearlyData = {
      change: Math.round(yearlyEarningsChange),
      chartValue: percentageOfTotalCurrentYear || 0,
      currentText: currentYearText,
      prevText: previousYearText,
      currentEarnings: currentYearEarnings,
    };

    return {
      monthlyData,
      yearlyData,
    };
  }, [sales]);

  console.log(yearlyData, "Monthly Data");

  return (
    <>
      <div className="shadow-sm w-full lg:w-[calc(50%-10px)] xl:w-full rounded-md p-5 border-bcolor border">
        <MonthlyEarnings type="year" title="Yearly Breakup" data={yearlyData} />
      </div>
      <div className="shadow-sm w-full lg:w-[calc(50%-10px)] xl:w-full rounded-md p-5 border-bcolor border">
        <MonthlyEarnings
          type="month"
          title="Monthly Earnings"
          data={monthlyData}
        />
      </div>
    </>
  );
}

export default CurrentAndPrev;
