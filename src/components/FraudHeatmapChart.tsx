"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface FraudHeatmapChartProps {
  fraudFlags: { date: string; amount: number }[];
}

export default function FraudHeatmapChart({ fraudFlags }: FraudHeatmapChartProps) {
  const fraudByDate: Record<string, number> = {};
  fraudFlags.forEach(({ date }) => {
    fraudByDate[date] = (fraudByDate[date] || 0) + 1;
  });

  const data = {
    labels: Object.keys(fraudByDate),
    datasets: [
      {
        label: "Suspicious Transactions",
        data: Object.values(fraudByDate),
        backgroundColor: "#f87171",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
}
