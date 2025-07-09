// src/lib/auth.ts

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";
//eslint-disable-next-line
export async function getUserFromToken(req: NextRequest): Promise<any | null> {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    //eslint-disable-next-line
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (err) {
    console.error("Token decode failed:", err);
    return null;
  }
}
