import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { Report } from "@/models/Report";

// GET /api/report/[id]
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const user = await getUserFromToken(req);
  const { params } = context;
  const report = await Report.findOne({ _id: params.id, userId: user._id });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({ report });
}

// DELETE /api/report/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const user = await getUserFromToken(req);
  const { params } = context;
  const report = await Report.findOneAndDelete({ _id: params.id, userId: user._id });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
