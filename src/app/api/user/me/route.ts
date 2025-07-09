import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify and decode token
    //eslint-disable-next-line
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId).select("name email isVerified isPremium");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fix: Wrap user inside `user: {...}`
    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
