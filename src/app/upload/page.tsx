"use client";

import { useState } from "react";

// Types for parsed report
interface EMI {
  date: string;
  amount: number;
  label: string;
  estimatedPrincipal?: number;
  currentRate?: number;
  recommendedRate?: number;
  monthlySavings?: number;
  suggestedBank?: string;
}

interface FraudFlag {
  date: string;
  amount: number;
  label: string;
  reason?: string;
}

interface ReportSummary {
  totalEMIs: number;
  suspiciousTxns: number;
  creditScore: number;
}

interface ReportInsights {
  totalLoanAmount: number;
  averageEMI: number;
  monthlyEMIs: Record<string, number>;
  suspiciousVendors: Record<string, number>;
  financialTips: string[];
}

interface ParsedReport {
  summary: ReportSummary;
  emis: EMI[];
  fraudFlags: FraudFlag[];
  creditTips: string[];
  advisor: EMI[];
  insights: ReportInsights;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParsedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/report/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResult(data.parsed);
    } else {
      setError(data.error || "Failed to parse file");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Bank Statement</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload & Analyze"}
      </button>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Report Summary</h2>
          <div className="mb-2">
            Credit Score: <b>{result.summary.creditScore}</b>
          </div>
          <div className="mb-2">
            Total EMIs: <b>{result.summary.totalEMIs}</b>
          </div>
          <div className="mb-2">
            Suspicious Transactions: <b>{result.summary.suspiciousTxns}</b>
          </div>
          <div className="mb-2">
            Credit Tips:
            <ul className="list-disc ml-6">
              {result.creditTips?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            Financial Tips:
            <ul className="list-disc ml-6">
              {result.insights?.financialTips?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            EMIs:
            <ul className="list-disc ml-6">
              {result.emis?.map((emi, idx) => (
                <li key={idx}>
                  {emi.date} - ₹{emi.amount} - {emi.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            Fraud Flags:
            <ul className="list-disc ml-6">
              {result.fraudFlags?.map((flag, idx) => (
                <li key={idx}>
                  {flag.date} - ₹{flag.amount} - {flag.label}{" "}
                  {flag.reason && `(Reason: ${flag.reason})`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}