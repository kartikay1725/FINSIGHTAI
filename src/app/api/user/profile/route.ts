// GET: Get user profile
// PUT: Update user profile (name, notificationPrefs)

import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    notificationPrefs: user.notificationPrefs || {
      suspiciousTxns: true,
      newReports: true,
      weeklySummary: true,
    },
  });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, notificationPrefs } = body;

  user.name = name ?? user.name;
  user.notificationPrefs = notificationPrefs ?? user.notificationPrefs;

  await user.save();

  return NextResponse.json({ success: true });
}
