// src/app/api/reports/route.ts
import { connectDB } from "@/lib/db";
import { Report } from "@/models/Report";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const cook = await cookies();
  const token = cook.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  //eslint-disable-next-line
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.userId;

  const reports = await Report.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json({ reports });
;
}
