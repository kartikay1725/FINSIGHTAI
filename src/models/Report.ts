// src/models/Report.ts
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  summary: {
    totalEMIs: Number,
    suspiciousTxns: Number,
    creditScore: Number,
  },
  emis: [
    {
      date: String,
      amount: Number,
      label: String,
    },
  ],
  fraudFlags: [
    {
      date: String,
      amount: Number,
      label: String,
      reason: String,
    },
  ],
  advisor: [
    {
      date: String,
      amount: Number,
      label: String,
      estimatedPrincipal: Number,
      currentRate: Number,
      recommendedRate: Number,
      monthlySavings: Number,
      suggestedBank: String,
    },
  ],
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
