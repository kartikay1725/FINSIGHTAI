import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const transactions = await Transaction.find().sort({ date: -1 }).limit(50);
  res.status(200).json({ transactions });
}
