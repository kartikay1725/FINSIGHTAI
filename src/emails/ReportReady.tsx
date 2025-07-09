// src/emails/ReportReady.tsx
import { Html, Text, Heading } from "@react-email/components";
import * as React from "react";

export default function ReportReadyEmail({ name }: { name: string }) {
  return (
    <Html>
      <Heading>Hi {name}, your FinSight Report is ready!</Heading>
      <Text>We have analyzed your bank statement and found some interesting insights. You can now check your dashboard for:</Text>
      <ul>
        <li>📊 Active EMIs</li>
        <li>🚨 Fraud detection alerts</li>
        <li>💡 Loan suggestions</li>
      </ul>
      <Text>Thanks for trusting FinSight AI.</Text>
    </Html>
  );
}
