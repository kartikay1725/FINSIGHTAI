// src/components/OnboardingModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";


interface Props {
  onComplete: () => void;
}

const steps = [
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

export default function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const handleNext = async () => {
    if (step < steps.length - 1) return setStep(step + 1);

    // ✅ Mark onboarding complete in backend
    const res = await fetch("/api/user/onboarding-complete", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      onComplete(); // ✅ Close modal
    } else {
      console.error("Failed to mark onboarding complete");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn text-center space-y-4">
        <h2 className="text-xl font-bold">{steps[step].title}</h2>
        <p className="text-zinc-600">{steps[step].desc}</p>
        <Button onClick={handleNext}>
          {step === steps.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}
