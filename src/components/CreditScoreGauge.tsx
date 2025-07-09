"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function CreditScoreGauge({ score }: { score: number }) {
  const maxScore = 900;
  const percentage = (score / maxScore) * 100;

  const data = {
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#4f46e5", "#e5e7eb"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="w-52 mx-auto text-center relative">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800">
        <p className="text-lg font-semibold">Score</p>
        <p className="text-3xl font-bold">{score}</p>
        <p className="text-sm text-zinc-500">out of 900</p>
      </div>
    </div>
  );
}
