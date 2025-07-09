// src/app/(legal)/privacy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 text-zinc-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data Collection</h2>
      <p className="mb-4">
        We collect your uploaded bank statements and usage data to provide personalized financial insights.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Data Storage</h2>
      <p className="mb-4">
        Your documents are stored securely and only used to generate reports. We do not sell or share your data with third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies & Tracking</h2>
      <p className="mb-4">
        We use cookies for login sessions and platform analytics only. You can opt-out through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
      <p className="mb-4">
        For questions about your data or this policy, email us at <a href="mailto:support@finsight.ai" className="text-indigo-600 underline">support@finsight.ai</a>.
      </p>
    </main>
  );
}
