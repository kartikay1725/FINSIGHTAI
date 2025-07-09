"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface EMITrendChartProps {
  emis: { date: string; amount: number }[];
}

export default function EMITrendChart({ emis }: EMITrendChartProps) {
  const data = {
    labels: emis.map(e => e.date),
    datasets: [
      {
        label: "EMI Amount Over Time",
        data: emis.map(e => e.amount),
        borderColor: "#4f46e5",
        backgroundColor: "#c7d2fe",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Line data={data} options={options} />;
}
