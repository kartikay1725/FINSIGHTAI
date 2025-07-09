"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Report {
  _id: string;
  summary: {
    totalEMIs: number;
    suspiciousTxns: number;
    creditScore: number;
  };
  createdAt: string;
}

async function handleDelete(reportId: string) {
  
  const res = await fetch(`/api/report/${reportId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    toast.success("Report deleted successfully");

  } else {
    toast.error("Failed to delete report");
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    async function fetchReports() {
      const res = await fetch("/api/report");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    }

    fetchReports();
  }, []);
const router = useRouter();
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">📁 Previous Reports</h2>

      {reports.length === 0 ? (
        <p className="text-zinc-500">No reports found. Upload a statement to generate your first report.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report._id}>
              <CardContent className="p-5 space-y-2">
                <h3 className="text-lg font-medium">Report Summary</h3>
                <p className="text-sm">📅 {formatDistanceToNow(new Date(report.createdAt))} ago</p>
                <p>📊 Credit Score: <strong>{report.summary.creditScore}</strong></p>
                <p>📌 EMIs: <strong>{report.summary.totalEMIs}</strong></p>
                <p>🚨 Fraud Alerts: <strong>{report.summary.suspiciousTxns}</strong></p>
                <Button
  className="mt-2"
  variant="secondary"
  onClick={() => router.push(`/dashboard/report/${report._id}`)}
>
  View Details
</Button>
<Button
  className="mt-2"
  variant="secondary"
  onClick={() =>{ handleDelete(report._id)
        router.push("/dashboard/report") }
  }
>
  Delete Report
</Button>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
