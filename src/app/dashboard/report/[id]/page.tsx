"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import EMITrendChart from "@/components/EMITrendChart";
import FraudHeatmapChart from "@/components/FraudHeatmapChart";
import { toast } from "sonner";

interface TxnData {
  date: string;
  amount: number;
  label: string;
  reason?: string;
}

interface AdvisorData {
  estimatedPrincipal: number;
  currentRate: number;
  recommendedRate: number;
  monthlySavings: number;
  suggestedBank: string;
  amount: number;
  date: string;
  label: string;
}

interface ParsedData {
  summary: {
    totalEMIs: number;
    suspiciousTxns: number;
    creditScore: number;
  };
  emis: TxnData[];
  fraudFlags: TxnData[];
  creditTips: string[];
  advisor: AdvisorData[];
}

export default function ReportDetailsPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const router = useRouter();
  const [report, setReport] = useState<ParsedData | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${id}`);
        if (!res.ok) throw new Error("Failed to fetch report");
        
        const data = await res.json();
setReport(data.report); // ✅ Fix here
; // handles .data structure
      } catch {
        toast.error("Unable to load report.");
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/report/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Report deleted.");
      router.push("/dashboard/report");
    } catch {
      toast.error("Failed to delete report.");
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`finsight-report-${id}.pdf`);
  };

  const renderTable = (data: TxnData[], title: string) => (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="py-1 px-2">Date</th>
            <th className="py-1 px-2">Amount</th>
            <th className="py-1 px-2">Label</th>
            {data[0]?.reason && <th className="py-1 px-2">Reason</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="py-1 px-2">{item.date}</td>
              <td className="py-1 px-2">₹{item.amount.toLocaleString()}</td>
              <td className="py-1 px-2">{item.label}</td>
              {item.reason && <td className="py-1 px-2">{item.reason}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!report) return <p className="p-6 text-zinc-500">Loading report...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">📊 FinSight Report</h2>
        <div className="flex gap-3">
          <Button onClick={handleDownloadPDF} variant="secondary">Download as PDF</Button>
          <Button onClick={handleDelete} variant="destructive">Delete Report</Button>
        </div>
      </div>

      <div id="report-content" className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <p>Total EMIs: {report.summary.totalEMIs}</p>
            <p>Suspicious Transactions: {report.summary.suspiciousTxns}</p>
            <p>Credit Score: {report.summary.creditScore}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">📈 EMI Trend</h3>
            <EMITrendChart emis={report.emis} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">🔥 Fraud Heatmap</h3>
            <FraudHeatmapChart fraudFlags={report.fraudFlags} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">💰 AI Loan Advisor</h3>
            {report.advisor.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {report.advisor.map((rec, i) => (
                  <li key={i} className="bg-green-50 p-3 rounded border border-green-300">
                    <p><strong>{rec.suggestedBank}</strong>: Save ₹{rec.monthlySavings}/month</p>
                    <p className="text-xs text-zinc-600">
                      Recommended EMI: ₹{rec.estimatedPrincipal} @ {rec.recommendedRate * 100}% (vs. {rec.currentRate * 100}%)
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-400">No recommendations available.</p>
            )}
          </CardContent>
        </Card>

        {renderTable(report.emis, "EMIs Detected")}
        {renderTable(report.fraudFlags, "Fraudulent / Anomalies")}
      </div>
    </div>
  );
}
