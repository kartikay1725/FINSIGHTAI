// src/app/api/user/last-report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { Report } from "@/models/Report"; // assuming report model

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const latest = await Report.findOne({ userId: user._id }).sort({ createdAt: -1 });

  if (!latest) return NextResponse.json({ error: "No report" }, { status: 404 });

  return NextResponse.json(latest);
}
