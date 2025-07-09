'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import EMIPieChart from '@/components/EMIPieChart';
import OnboardingModal from '@/components/OnboardingModal';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FinReportPDF } from "@/components/FinReportPDF";
import Link from "next/link";

interface TxnData {
  date: string;
  amount: number;
  label: string;
  reason?: string;
}

interface Recommendation {
  newProvider: string;
  savingsPerMonth: number;
  newEMI: number;
  originalEMI: number;
}

interface ParsedData {
  summary: {
    totalEMIs: number;
    suspiciousTxns: number;
    creditScore: number;
  };
  emis: TxnData[];
  fraudFlags: TxnData[];
  advisor: Recommendation[];
  insights: {
    totalLoanAmount: number;
    averageEMI: number;
    monthlyEMIs: Record<string, number>;
    suspiciousVendors: Record<string, number>;
    financialTips: string[];
  };
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name, email: data.email });
        if (!data.hasCompletedOnboarding) setShowOnboarding(true);
      }
    }

    async function fetchScore() {
      const res = await fetch('/api/score/generate');
      if (res.ok) {
        const data = await res.json();
        setCreditScore(data.score);
      }
    }

    fetchUser();
    fetchScore();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a PDF.');
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/report/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setParsed(data.parsed);
        toast.success('Report processed successfully!');
      } else {
        toast.error(data.error || 'Failed to process file.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };
//eslint-disable-next-line
  const exportPDF = async () => {
    function replaceOKLCHColors(element: HTMLElement) {
  const elements = element.querySelectorAll("*");

  elements.forEach((el) => {
    const style = getComputedStyle(el);
    for (const prop of ["color", "backgroundColor", "borderColor"]) {
      const val = style.getPropertyValue(prop);
      if (val.includes("oklch")) {
        (el as HTMLElement).style.setProperty(prop, "#000"); // or any fallback color
      }
    }
  });
}

// Usage before html2canvas
replaceOKLCHColors(document.body);
    const canvas = await html2canvas(document.body);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('finsight-report.pdf');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}

      <div className="flex min-h-screen text-zinc-800 transition-all">
        <aside className="w-64 bg-zinc-900 text-white p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-8">FinSight AI</h1>
            <nav className="space-y-4">
              <Link className="hover:text-indigo-400 block" href="#dashboard">🏠 Dashboard</Link>
               <Link className="hover:text-indigo-400 block" href="/dashboard/report"> Reports</Link>
              <Link className="hover:text-indigo-400 block" href="#loans">💼 Active Loans</Link>
              <Link className="hover:text-indigo-400 block" href="#alerts">🚨 Anomalies</Link>
              <Link className="hover:text-indigo-400 block" href="#advisor">💡 Advisor</Link>
              <Link className="hover:text-indigo-400 block" href="#score">📊 Score</Link>
              <Link className="hover:text-indigo-400 block" href="/dashboard/assistant">🤖 Assistant</Link>
              <Link className="hover:text-indigo-400 block" href="/dashboard/settings">⚙️ Settings</Link>
             
            </nav>
          </div>
          <div className="text-sm text-gray-300 mt-6">
            <p className="mb-2 text-xs text-gray-400">{user?.email}</p>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </aside>

        <main className="flex-1 bg-gray-50 p-6 space-y-10 overflow-y-auto">
          <section id="dashboard">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold">📁 Upload Bank Statement</h3>
                <p className="text-sm text-zinc-600">PDF only – backend will securely parse it.</p>
                <div className="flex flex-wrap gap-4">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload & Analyze'}
                  </Button>
                  {parsed && (
  <PDFDownloadLink
    document={<FinReportPDF parsed={parsed} />}
    fileName="finsight-report.pdf"
  >
    {({ loading }) => (loading ? "Generating..." : "📥 Download Report")}
  </PDFDownloadLink>
)}
                </div>
                {parsed && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-zinc-700">
                    <p>✅ Total EMIs: {parsed.summary.totalEMIs}</p>
                    <p>🚨 Suspicious Txns: {parsed.summary.suspiciousTxns}</p>
                    <p>📊 Score: {parsed.summary.creditScore}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {creditScore && (
            <section id="score">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">📈 Credit Score</h3>
                  <p className="text-sm text-zinc-500">Estimated Score</p>
                  <p className="text-4xl font-bold text-indigo-600">{creditScore}/850</p>
                  <div className="mt-2 bg-gray-200 h-2 rounded">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${(creditScore / 850) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card id="loans">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">💼 Active EMIs</h3>
                {parsed?.emis?.length ? (
                  <EMIPieChart emis={parsed.emis} />
                ) : (
                  <p className="text-zinc-400 mt-2">No EMI data available.</p>
                )}
              </CardContent>
            </Card>
<Card id="alerts">
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold">🚨 Fraud Detection</h3>
    {parsed?.fraudFlags?.length ? (
      <ul className="mt-3 space-y-3">
        {parsed.fraudFlags.map((txn, idx) => (
          <li key={idx} className="border-l-4 border-red-500 pl-3 text-red-700 text-sm bg-red-50 p-2 rounded">
            <p><strong>Date:</strong> {txn.date}</p>
            <p><strong>Amount:</strong> ₹{typeof txn.amount === "number" ? txn.amount.toLocaleString() : "N/A"}</p>
            <p><strong>Description:</strong> {txn.label}</p>
            {txn.reason && <p className="italic text-xs text-gray-500">Reason: {txn.reason}</p>}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-zinc-400 mt-2">No suspicious activity found.</p>
    )}
  </CardContent>
</Card>

            <Card id="advisor">
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold">💡 AI Loan Advisor</h3>
    {parsed?.advisor?.length ? (
      parsed.advisor.map((rec, i) => (
        <div key={i} className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm mb-3">
          <h4 className="text-green-700 font-semibold mb-1">{rec.newProvider || "N/A"}</h4>
          <p className="text-sm text-green-900">
            You can save <strong>
              ₹{typeof rec.savingsPerMonth === "number" ? rec.savingsPerMonth.toLocaleString() : "N/A"}
            </strong> monthly by refinancing.
          </p>
          <p className="text-xs text-gray-600">
            New EMI: ₹{typeof rec.newEMI === "number" ? rec.newEMI.toLocaleString() : "N/A"} &nbsp;|&nbsp; 
            Current EMI: ₹{typeof rec.originalEMI === "number" ? rec.originalEMI.toLocaleString() : "N/A"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-zinc-400 mt-2">No personalized advice yet.</p>
    )}
  </CardContent>
</Card>

          </div>
        </main>
      </div>
    </>
  );
}
