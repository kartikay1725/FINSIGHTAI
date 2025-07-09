// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import  pdfParse from "pdf-parse";
import { readFileSync } from "fs";
import { Report } from "@/models/Report";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

function extractTransactions(text: string) {
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
  const transactions = [];

  for (const line of lines) {
    if (line.match(/EMI|Loan|UPI|NEFT|Interest/i)) {
      const dateMatch = line.match(/\d{2}-\d{2}-\d{4}/);
      const amountMatch = line.match(/(?:INR|Rs\.?) ?(\d+[\d,]*\.?\d{0,2})/i);

      transactions.push({
        date: dateMatch?.[0] || "Unknown",
        description: line,
        amount: amountMatch?.[1] || "0",
      });
    }
  }

  return transactions;
}

//eslint-disable-next-line
function analyzeTransactions(transactions: any[]) {
  let emiCount = 0;
  let loanMentions = 0;
  let suspicious = 0;
  let totalAmount = 0;

  for (const tx of transactions) {
    const desc = tx.description.toLowerCase();
    const amt = parseFloat(tx.amount.replace(/,/g, ""));

    if (desc.includes("emi")) emiCount++;
    if (desc.includes("loan")) loanMentions++;
    if (desc.includes("interest") || desc.includes("duplicate")) suspicious++;

    totalAmount += amt;
  }

  // Estimate CIBIL score (just a hint)
  const cibilEstimate = 800 - suspicious * 10 - emiCount * 3;

  return {
    totalTransactions: transactions.length,
    emiCount,
    loanMentions,
    suspiciousFlags: suspicious,
    totalAmount,
    estimatedCIBIL: Math.max(300, Math.min(900, Math.round(cibilEstimate))),
  };
}


export async function POST(req: NextRequest) {
    await connectDB();
const cook = await cookies();
const token = cook.get("token")?.value;
if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//eslint-disable-next-line
const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
const userId = decoded.userId;
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuid()}.pdf`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);
  await writeFile(filepath, buffer);

  const pdfBuffer = readFileSync(filepath);
  const pdfData = await pdfParse(pdfBuffer);
  const rawText = pdfData.text;

  // 🔍 Extract transactions
  const transactions = extractTransactions(rawText);
  const analysis = analyzeTransactions(transactions);

  await Report.create({
  userId,
  filename,
  transactions,
  summary: analysis,
});

  return NextResponse.json({
    message: "PDF analyzed",
    transactions,
    summary: analysis,
  });
}
