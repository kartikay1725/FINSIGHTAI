import cron from "node-cron";
import { sendWeeklyDigestEmails } from "@/cron/weeklyDigest";

cron.schedule("0 9 * * 1", async () => {
  console.log("Running weekly digest job...");
  await sendWeeklyDigestEmails();
});
