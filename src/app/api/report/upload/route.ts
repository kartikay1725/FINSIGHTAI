import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Report } from "@/models/Report";
import PDFParser from "pdf2json";
import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPDF(buffer);
    const analysis = await analyzePDF(text);

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //eslint-disable-next-line
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const saved = await Report.create({
      userId: user._id,
      ...analysis,
    });

    return NextResponse.json({ parsed: saved });
  }
  //eslint-disable-next-line
  catch (err: any) {
    console.error("Error in /api/report/upload:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const text = await parsePDFUsingPdf2json(buffer);
  if (text && text.trim().length > 30) return text;

  console.warn("🔁 Falling back to OCR");
  return await extractUsingOCR(buffer);
}

function parsePDFUsingPdf2json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      const pages = pdfData?.Pages || [];
      const text = pages
      //eslint-disable-next-line
        .map((page: any) =>
          //eslint-disable-next-line
          page.Texts?.map((t: any) => {
            try {
              return decodeURIComponent(t.R[0].T);
            } catch {
              return "";
            }
          }).join(" ")
        )
        .join("\n");
      resolve(text || "");
    });
    pdfParser.parseBuffer(buffer);
  });
}

async function extractUsingOCR(buffer: Buffer): Promise<string> {
  const tempPath = "/tmp/temp.pdf";
  fs.writeFileSync(tempPath, buffer);

  const convert = fromPath(tempPath, {
    density: 200,
    saveFilename: "ocr-page",
    savePath: "/tmp",
    format: "png",
  });

  const image = await convert(1);
  if (!image.path) throw new Error("Image path undefined for OCR.");

  const result = await Tesseract.recognize(image.path, "eng");
  return result.data.text;
}

async function analyzePDF(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const loanKeywords = ["emi", "loan", "instalment", "bajaj", "hdfc", "axis", "sbi"];
  const suspiciousKeywords = ["upi", "debit", "reversal", "revoked", "unknown", "failed"];
  const dateRegex = /\b\d{1,2}[\/\-]?(Jan|Feb|Mar|...|Dec)[a-z]*[\/\-]?\d{2,4}\b/i;
  const amountRegex = /₹?\s?([0-9,]+\.?\d{0,2})/;

  const emis = [];
  const fraudFlags = [];
  const labelMap: Record<string, number> = {};

  for (const line of lines) {
    const lower = line.toLowerCase();
    const date = line.match(dateRegex)?.[0] || "Unknown";
    const amtMatch = line.match(amountRegex);
    const amount = amtMatch ? parseFloat(amtMatch[1].replace(/,/g, "")) : NaN;

    if (isNaN(amount)) continue;

    if (loanKeywords.some(w => lower.includes(w))) {
      emis.push({ date, amount, label: line });
    }

    if (suspiciousKeywords.some(w => lower.includes(w))) {
      const reason = suspiciousKeywords.find(w => lower.includes(w));
      fraudFlags.push({ date, amount, label: line, reason });
    }

    if (labelMap[line]) {
      labelMap[line]++;
      if (labelMap[line] === 2) {
        fraudFlags.push({ date, amount, label: line, reason: "Duplicate transaction" });
      }
    } else {
      labelMap[line] = 1;
    }
  }

  const advisor = emis.map(emi => {
    const term = 12;
    const baseRate = 0.012;
    const P = emi.amount * ((Math.pow(1 + baseRate, term) - 1) / (baseRate * Math.pow(1 + baseRate, term)));

    let recommendedRate = 0.0125;
    let provider = "IDFC FIRST";

    if (emi.amount < 2000) {
      recommendedRate = 0.007;
      provider = "KreditBee";
    } else if (emi.amount < 5000) {
      recommendedRate = 0.009;
      provider = "Slice";
    } else if (emi.amount < 8000) {
      recommendedRate = 0.010;
      provider = "Axis Bank";
    } else if (emi.amount < 15000) {
      recommendedRate = 0.0115;
      provider = "HDFC";
    }

    const newEMI = (P * recommendedRate * Math.pow(1 + recommendedRate, term)) / (Math.pow(1 + recommendedRate, term) - 1);

    return {
      newProvider: provider,
      savingsPerMonth: Math.round(emi.amount - newEMI),
      newEMI: Math.round(newEMI),
      originalEMI: emi.amount,
    };
  });

  const creditScore = Math.max(300, 850 - fraudFlags.length * 20 - (emis.length < 3 ? 30 : 0) - (emis.length > 5 ? 40 : 0));

  const monthlyEMIs: Record<string, number> = {};
  emis.forEach(({ date, amount }) => {
    const month = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });
    monthlyEMIs[month] = (monthlyEMIs[month] || 0) + amount;
  });

  const suspiciousVendors: Record<string, number> = {};
  fraudFlags.forEach(({ label }) => {
    const vendor = label.split(" ")[0];
    suspiciousVendors[vendor] = (suspiciousVendors[vendor] || 0) + 1;
  });

  const financialTips = [
    creditScore > 700 ? "✅ Your credit score is healthy. Keep EMI ratio low." : "⚠️ Reduce EMI burden to improve score.",
    emis.length > 5 ? "📉 Too many loans active. Consider consolidation." : "📈 Loan burden is manageable.",
    fraudFlags.length ? "🚨 Suspicious transactions found. Review them ASAP." : "✅ No fraud detected this month.",
  ];

  return {
    summary: {
      totalEMIs: emis.length,
      suspiciousTxns: fraudFlags.length,
      creditScore,
    },
    emis,
    fraudFlags,
    advisor,
    insights: {
      totalLoanAmount: emis.reduce((sum, e) => sum + e.amount, 0),
      averageEMI: emis.length ? Math.round(emis.reduce((a, b) => a + b.amount, 0) / emis.length) : 0,
      monthlyEMIs,
      suspiciousVendors,
      financialTips,
    },
  };
}
