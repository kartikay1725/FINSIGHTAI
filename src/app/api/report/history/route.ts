// src/app/api/report/history/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Report } from "@/models/Report";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //eslint-disable-next-line
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const reports = await Report.find({ userId: decoded.userId }).sort({ createdAt: -1 });

  return NextResponse.json({ reports });
}
