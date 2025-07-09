// /api/cron/weekly-digest/route.ts
import { NextResponse } from "next/server";
import { sendWeeklyDigestEmails } from "@/cron/weeklyDigest";

export async function GET() {
  await sendWeeklyDigestEmails();
  return NextResponse.json({ status: "Weekly digest emails sent." });
}
