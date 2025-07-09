import { NextApiRequest, NextApiResponse } from "next";
import pdf from "pdf-parse";
import formidable from "formidable";
import fs from "fs";
import { parseTextToTransactions } from "@/utils/parseText";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/Transaction";


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) return res.status(500).json({ error: "File error" });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const buffer = fs.readFileSync(file.filepath);
    const data = await pdf(buffer);
    const text = data.text;

    const transactions = parseTextToTransactions(text);
    const saved = await Transaction.insertMany(transactions);
    return res.status(200).json({ transactions: saved });

    
  });
}
