"use client";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center px-4 text-center">
      {/* Logo and brand */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-xl font-semibold">
        <span className="text-indigo-600 text-2xl">🤖</span>
        <span className="text-gray-900">FinSight AI</span>
      </div>

      {/* Welcome Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
        Welcome to <span className="text-indigo-600">FinSight AI</span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-10">
        Your AI-powered financial watchdog. Upload your bank statement and get
        instant insights into your loans, spending, and potential fraud.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          className="bg-indigo-600 text-white px-6 py-2 text-lg hover:bg-indigo-700"
          onClick={() => window.location.href = "/login"}
        >
          Login
        </Button>
        <Button
          variant="outline"
          className="px-6 py-2 text-lg border-gray-300 text-gray-800 hover:bg-gray-100"
          onClick={() => window.location.href = "/register"}
        >
          Register
        </Button>
      </div>
    </main>
  );
}
