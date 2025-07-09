// src/app/api/user/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { User } from "@/models/User";

export async function DELETE(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await User.findByIdAndDelete(user._id);
  return NextResponse.json({ success: true });
}
