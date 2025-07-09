// src/app/api/report/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { summary, transactions } = body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  //es
  const {  height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text: string, y: number, size = 12) => {
    page.drawText(text, {
      x: 50,
      y,
      size,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  };

  let y = height - 50;
  drawText("📄 Financial Statement Report", y, 18);
  y -= 40;

  drawText(`Estimated CIBIL Score: ${summary.estimatedCIBIL}`, y); y -= 20;
  drawText(`EMI Count: ${summary.emiCount}`, y); y -= 20;
  drawText(`Loan Mentions: ${summary.loanMentions}`, y); y -= 20;
  drawText(`Suspicious Entries: ${summary.suspiciousFlags}`, y); y -= 20;
  drawText(`Total Transactions: ${summary.totalTransactions}`, y); y -= 20;
  drawText(`Total Amount Analyzed: ₹${summary.totalAmount.toFixed(2)}`, y); y -= 40;

  drawText("Top 10 Transactions:", y, 14); y -= 20;
  //eslint-disable-next-line
  transactions.slice(0, 10).forEach((tx: any, i: number) => {
    drawText(`${i + 1}. ${tx.date} - ₹${tx.amount} - ${tx.description.slice(0, 40)}`, y);
    y -= 16;
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=FinSight_Report.pdf",
    },
  });
}
