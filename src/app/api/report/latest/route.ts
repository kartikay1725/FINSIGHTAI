import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import { Report } from "@/models/Report";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //eslint-disable-next-line
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const user = await User.findById(decoded.userId);

  const report = await Report.findOne({ userId: user._id }).sort({ createdAt: -1 });
  if (!report) return NextResponse.json({ error: "No report found" }, { status: 404 });

  return NextResponse.json({ parsed: report.data });
}
