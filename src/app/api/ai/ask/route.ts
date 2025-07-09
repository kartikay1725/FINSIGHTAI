import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { Report } from "@/models/Report";
import { AssistantMessage } from "@/models/AssistantMessage";
import { groq } from "@/lib/groq"; // Make sure this is your Groq SDK instance

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Ensure DB is connected

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Decode JWT
    //eslint-disable-next-line
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Get user query
    const body = await req.json();
    const query = body.query;
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Get user's last financial report (context)
    const latestReport = await Report.findOne({ userId }).sort({ createdAt: -1 });
    const context = latestReport?.data || {};

    // Get recent AI message history
    const history = await AssistantMessage.find({ userId }).sort({ createdAt: 1 }).limit(10);

    // Prepare chat array
    const messages = [
      {
        role: "system",
        content: `You are a smart personal finance assistant. 
You can answer any type of finance-related question: EMIs, loan tips, credit score, budgeting, taxes, and personal financial advice.
You can also reference the user's past data if provided in the context.
Be clear, practical, and non-judgmental.`,
      },
      {
        role: "system",
        content: `User financial context:\n${JSON.stringify(context, null, 2)}`,
      },
      ...history.map((msg) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text,
      })),
      {
        role: "user",
        content: query,
      },
    ];

    // Get AI response from Groq
    const aiRes = await groq.chat.completions.create({
      model: "llama3-70b-8192", // best for detailed answers
      //eslint-disable-next-line
      messages: messages as any, // enforce safe cast
      temperature: 0.7,
    });

    const reply = aiRes.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";

    // Save user and AI messages
    await AssistantMessage.create({ userId, role: "user", text: query });
    await AssistantMessage.create({ userId, role: "ai", text: reply });

    return NextResponse.json({ reply });
  } 
  //eslint-disable-next-line
  catch (err: any) {
    console.error("AI Error:", err);
    return NextResponse.json({ error: "AI failed to generate a response" }, { status: 500 });
  }
}
