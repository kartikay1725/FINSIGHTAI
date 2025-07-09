// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  hasCompletedOnboarding: { type: Boolean, default: false },
  usageCounts: {
    uploads: { type: Number, default: 0 },
  },
  blockedUntil: { type: Date, default: null },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
