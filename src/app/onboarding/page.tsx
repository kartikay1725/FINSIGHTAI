"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const pages = [
  {
    title: "Welcome to FinSight AI 👋",
    desc: "Let’s help you get financially smarter with AI-driven insights.",
  },
  {
    title: "Upload & Analyze",
    desc: "Upload your bank statement and get credit scores, fraud alerts, and more.",
  },
  {
    title: "Stay Informed",
    desc: "Get notified when anomalies are detected. Download reports, get tips, and take control.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = async () => {
    if (step < pages.length - 1) {
      setStep(step + 1);
      return;
    }

    // ✅ Mark onboarding complete
    try {
      const res = await fetch("/api/user/onboarding-complete", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Onboarding failed:", error);
        return;
      }

      // ✅ Redirect if successful
      router.push("/dashboard");
    } catch (err) {
      console.error("Error during onboarding:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">{pages[step].title}</h1>
        <p className="text-zinc-600">{pages[step].desc}</p>
        <Button onClick={handleNext} className="mt-4">
          {step === pages.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
