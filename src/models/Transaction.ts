import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  date: string;
  amount: number;
  narration: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    date: String,
    amount: Number,
    narration: String,
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
