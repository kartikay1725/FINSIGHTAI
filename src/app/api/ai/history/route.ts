import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AssistantMessage } from "@/models/AssistantMessage";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ history: [] });
    //eslint-disable-next-line
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const history = await AssistantMessage.find({ userId }).sort({ createdAt: 1 });
    return NextResponse.json({ history });
  } catch (err) {
    console.error("Fetch AI history error:", err);
    return NextResponse.json({ history: [] });
  }
}
