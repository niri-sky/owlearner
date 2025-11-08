import dynamic from "next/dynamic";
import React from "react";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  data: {
    month: string;
    value: number;
  }[];
};

function DashboardChart({ data }: Props) {
  const chart = {
    series: [
      {
        data: data.map((v) => v.value),
      },
    ],
    options: {
      chart: {
        height: 350,
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: data.map((v) => [v.month]),
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },
  };

  return (
    <Chart
      options={chart.options}
      series={chart.series}
      type="bar"
      width={"100%"}
      height={300}
    />
  );
}

export default DashboardChart;
