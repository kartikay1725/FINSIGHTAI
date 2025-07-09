// src/app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST() {
    const cook = await cookies();
  cook.set("token", "", { maxAge: 0 });
  return NextResponse.json({ message: "Logged out" });
}
