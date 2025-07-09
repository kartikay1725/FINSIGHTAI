"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EMIPieChart({ emis }: { emis: { label: string; amount: number }[] }) {
  const groups: Record<string, number> = {};

  emis.forEach(({ label, amount }) => {
    groups[label] = (groups[label] || 0) + amount;
  });

  const data = {
    labels: Object.keys(groups),
    datasets: [
      {
        label: "EMI Amount",
        data: Object.values(groups),
        backgroundColor: [
          "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#14b8a6",
        ],
      },
    ],
  };

  return (
    <div className="max-w-sm mx-auto">
      <Pie data={data} />
    </div>
  );
}
