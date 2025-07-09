// src/components/TransactionChart.tsx
"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  transactions: { date: string; amount: string }[];
};

export default function TransactionChart({ transactions }: Props) {
  const monthly: { [month: string]: number } = {};

  transactions.forEach((t) => {
    //eslint-disable-next-line
    const [day, month, year] = t.date.split("-");
    const key = `${month}-${year}`;
    const amt = parseFloat(t.amount.replace(/,/g, "")) || 0;
    monthly[key] = (monthly[key] || 0) + amt;
  });

  const labels = Object.keys(monthly);
  const dataPoints = labels.map((m) => monthly[m]);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Spending",
        data: dataPoints,
        borderColor: "#6366f1",
        backgroundColor: "#6366f122",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Spending Over Time</h3>
      <Line data={data} />
    </div>
  );
}
