import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { Report } from "@/models/Report"; // Assume this holds parsed EMI/fraud data

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const latestReport = await Report.findOne({ userId: user._id }).sort({ createdAt: -1 });

  if (!latestReport || !latestReport.parsed) {
    return NextResponse.json({ score: 650, reason: "No recent reports" });
  }

  const { emis = [], fraudFlags = [] } = latestReport.parsed;
  const emiCount = emis.length;
  const fraudCount = fraudFlags.length;

  let score = 700;

  // Penalize for too many loans or fraud
  if (emiCount > 6) score -= 40;
  if (fraudCount > 2) score -= 50;
  if (emiCount === 0) score -= 30;

  score = Math.max(300, Math.min(850, score));

  return NextResponse.json({ score, emiCount, fraudCount });
}
