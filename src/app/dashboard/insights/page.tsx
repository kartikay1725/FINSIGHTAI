'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar} from "react-chartjs-2";
import "chart.js/auto";

interface InsightData {
  totalPaid: number;
  averageEMI: number;
  topVendors: { name: string; total: number }[];
  gptAdvice: string;
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);

  useEffect(() => {
    fetch('/api/user/last-report') // <- your route to fetch latest report
      .then(res => res.json())
      .then(json => setData(json.insights));
  }, []);

  if (!data) return <p className="p-6 text-zinc-600">Loading insights...</p>;

  const vendorChart = {
    labels: data.topVendors.map(v => v.name),
    datasets: [{
      label: "Suspicious Vendor Totals",
      data: data.topVendors.map(v => v.total),
      backgroundColor: "#f87171",
    }],
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">AI-Powered Financial Insights</h2>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p>Total Loans Paid: ₹{data.totalPaid.toLocaleString()}</p>
          <p>Average EMI: ₹{data.averageEMI.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Top Suspicious Vendors</h3>
          <Bar data={vendorChart} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">GPT Financial Advice</h3>
          <p className="text-sm text-zinc-700">{data.gptAdvice}</p>
        </CardContent>
      </Card>
    </div>
  );
}
