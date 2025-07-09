// src/app/api/user/onboarding-complete/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db"; // make sure you’re connecting to DB

export async function POST() {
  await connectDB(); // ✅ ensure DB is connected
    const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log(token)
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //eslint-disable-next-line
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch  {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  console.log('completed the onboarding process')
  user.hasCompletedOnboarding = true;
  console.log('user saved');
  await user.save();
  console.log('status 200');
  return NextResponse.json({ message: "Onboarding complete" });
}
