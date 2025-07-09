// src/app/(legal)/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 text-zinc-800">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="mb-4">
        By accessing and using our FinSight platform, you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the Platform</h2>
      <p className="mb-4">
        The services provided are for personal financial analysis only. Misuse of the platform, including unauthorized scraping or hacking, is prohibited.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Data Accuracy</h2>
      <p className="mb-4">
        While we strive for accurate analysis, the AI-generated insights are for informational purposes and not financial advice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Account Suspension</h2>
      <p className="mb-4">
        We reserve the right to suspend accounts violating our terms or abusing the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Changes to Terms</h2>
      <p className="mb-4">
        We may update these terms from time to time. Continued use implies acceptance of the updated terms.
      </p>
    </main>
  );
}
