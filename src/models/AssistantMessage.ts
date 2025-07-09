import mongoose from "mongoose";

const assistantMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const AssistantMessage =
  mongoose.models.AssistantMessage || mongoose.model("AssistantMessage", assistantMessageSchema);
