import moment from "moment";
export const calculateTotalEarnings = (sales: AnalyticsSales[]) => {
  return sales.reduce((total, sale) => total + sale.price, 0);
};

const monthNames: { [month: number]: string } = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const calculateLast8MonthsEarnings = (
  sales: AnalyticsSales[],
  paymentInvoices: PaymentInvoiceType[]
) => {
  const last8MonthsEarnings = [];

  const currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1;
  let currentYear = currentDate.getFullYear();

  for (let i = 0; i < 8; i++) {
    if (currentMonth === 0) {
      currentMonth = 12; // Adjust to December if the current month is January
      currentYear--; // Move to the previous year
    }

    const totalSales = sales.filter((sale) => {
      const d = new Date(sale.createdAt);
      return (
        d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
      );
    });
    const earningsOfMonth = totalSales.reduce(
      (total, sale) => total + sale.price,
      0
    );

    const expensesOfMonth = paymentInvoices
      .filter((invoice) => {
        const d = new Date(invoice.requestDate);
        return (
          d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
        );
      })
      .reduce((total, invoice) => total + invoice.amount, 0);

    last8MonthsEarnings.unshift({
      month: monthNames[currentMonth],
      earn: earningsOfMonth,
      expense: expensesOfMonth,
      year: currentYear,
      sales: totalSales.length,
      shortMonth: monthNames[currentMonth].slice(0, 3),
    });

    currentMonth--;
  }

  return last8MonthsEarnings;
};

export const getLast12MonthsEarnings = (sales: AnalyticsSales[]) => {
  let last12MonthsEarnings: {
    date: string;
    price: number;
  }[] = [];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  for (let i = 0; i < 12; i++) {
    const month = (currentMonth - i + 12) % 12 || 12; // Handle wrapping around to previous year

    const earningsOfMonth = sales
      .filter((sale) => new Date(sale.createdAt).getMonth() + 1 === month)
      .map((v) => ({
        date: moment(v.createdAt).format("ll"),
        price: v.price,
      }));

    last12MonthsEarnings = last12MonthsEarnings.concat(earningsOfMonth);
  }

  return last12MonthsEarnings;
};

export const calculateMonthlyEarnings = (sales: AnalyticsSales[]) => {
  const monthlyEarnings: { [monthYear: string]: number } = {};

  sales.forEach((sale) => {
    const saleDate = new Date(sale.createdAt);
    const month = saleDate.getMonth() + 1;
    const year = saleDate.getFullYear();
    const monthYearKey = `${monthNames[month]}/${year}`;

    monthlyEarnings[monthYearKey] =
      (monthlyEarnings[monthYearKey] || 0) + sale.price;
  });

  return monthlyEarnings;
};

export const calculatePercentageChange = (
  current: number,
  previous: number
) => {
  if (previous == 0 && current == 0) return 0;
  if (previous == 0) return 100;
  return ((current - previous) / previous) * 100;
};

export const calculateCurrentAndPrevious = (sales: AnalyticsSales[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const previousDate = new Date(currentDate);
  previousDate.setMonth(previousDate.getMonth() - 1);
  const previousMonth = previousDate.getMonth() + 1;

  const previousYearDate = new Date(currentDate);
  previousYearDate.setFullYear(previousDate.getFullYear() - 1);
  const previousYear = previousYearDate.getFullYear();

  const monthNames: { [key: number]: string } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  let currentMonthEarnings = 0;
  let previousMonthEarnings = 0;
  let currentYearEarnings = 0;
  let previousYearEarnings = 0;

  currentMonthEarnings = sales
    .filter((sale) => new Date(sale.createdAt).getMonth() + 1 === currentMonth)
    .reduce((total, sale) => total + sale.price, 0);

  previousMonthEarnings = sales
    .filter((sale) => new Date(sale.createdAt).getMonth() + 1 === previousMonth)
    .reduce((total, sale) => total + sale.price, 0);

  currentYearEarnings = sales
    .filter((sale) => new Date(sale.createdAt).getFullYear() === currentYear)
    .reduce((total, sale) => total + sale.price, 0);

  previousYearEarnings = sales
    .filter((sale) => new Date(sale.createdAt).getFullYear() === previousYear)
    .reduce((total, sale) => total + sale.price, 0);

  const totalCurrentAndPreviousMonthEarnings =
    currentMonthEarnings + previousMonthEarnings;
  const percentageOfTotalCurrentMonth =
    (currentMonthEarnings / totalCurrentAndPreviousMonthEarnings) * 100;

  const totalCurrentAndPreviousYearEarnings =
    currentYearEarnings + previousYearEarnings;
  const percentageOfTotalCurrentYear =
    (currentYearEarnings / totalCurrentAndPreviousYearEarnings) * 100;

  const currentMonthText = monthNames[currentMonth];
  const previousMonthText = monthNames[previousMonth];
  const currentYearText = currentYear.toString();
  const previousYearText = previousYear.toString();

  const monthlyEarningsChange = calculatePercentageChange(
    currentMonthEarnings,
    previousMonthEarnings
  );
  const yearlyEarningsChange = calculatePercentageChange(
    currentYearEarnings,
    previousYearEarnings
  );

  return {
    currentMonthEarnings,
    previousMonthEarnings,
    currentYearEarnings,
    previousYearEarnings,
    percentageOfTotalCurrentMonth,
    percentageOfTotalCurrentYear,
    currentMonthText,
    previousMonthText,
    currentYearText,
    previousYearText,
    monthlyEarningsChange,
    yearlyEarningsChange,
  };
};
