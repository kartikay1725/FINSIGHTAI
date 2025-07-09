export const weeklyDigestEmail = (userName: string, stats: {
  totalEMIs: number;
  suspiciousTxns: number;
  creditScore: number;
}) => `
  <div style="font-family: sans-serif; padding: 20px;">
    <h2>📈 Your Weekly Financial Summary</h2>
    <p>Hi ${userName}, here’s your financial snapshot:</p>
    <ul>
      <li>Total Active EMIs: <strong>${stats.totalEMIs}</strong></li>
      <li>Suspicious Transactions: <strong>${stats.suspiciousTxns}</strong></li>
      <li>Credit Score: <strong>${stats.creditScore}</strong></li>
    </ul>
    <p>Visit your dashboard for detailed insights and advice.</p>
    <a href="https://your-domain.com/dashboard" style="color:#4f46e5;">Go to Dashboard</a>
    <hr />
    <small>FinSight AI – Helping you improve your financial future.</small>
  </div>
`;
