export const fraudAlertEmail = (userName: string, count: number) => `
  <div style="font-family: sans-serif; padding: 20px;">
    <h2>🚨 Alert: Suspicious Transactions Detected</h2>
    <p>Hi ${userName},</p>
    <p>We found <strong>${count}</strong> suspicious transaction(s) in your latest bank statement upload.</p>
    <p>Please review them from your dashboard and take appropriate action.</p>
    <a href="https://your-domain.com/dashboard" style="color:#4f46e5;">View Dashboard</a>
    <hr/>
    <small>FinSight AI – Proactively monitoring your financial health.</small>
  </div>
`;
