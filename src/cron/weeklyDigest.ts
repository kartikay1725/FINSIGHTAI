import { resend } from "@/lib/resend";
import { User } from "@/models/User";
import { Report } from "@/models/Report";
import { weeklyDigestEmail } from "@/lib/email/weeklyDigest";

export async function sendWeeklyDigestEmails() {
  const users = await User.find();

  for (const user of users) {
    const latestReport = await Report.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!latestReport || !user.email) continue;

    const { summary } = latestReport.parsed || {};

    if (!summary) continue;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: "📈 Your Weekly FinSight Report",
      html: weeklyDigestEmail(user.name || "User", summary),
    });
  }
}
