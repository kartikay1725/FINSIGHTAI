"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //eslint-disable-next-line
  const [error, setError] = useState("");

  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !email.trim() || !password.trim()) {
    toast.error("All fields are required");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log("Register Response:", data);

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success("Registration successful");
    router.push("/login"); // ✅ redirect to login after successful registration
  } catch (err) {
    console.error("Registration Error:", err);
    toast.error("Network or server error");
  }
};
  

  return (
    <main className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center px-4">
      <div className="absolute top-6 left-6 text-xl font-semibold flex items-center gap-2">
        <span className="text-indigo-600 text-2xl">🤖</span>
        <span>FinSight AI</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-none bg-white">
        <CardContent className="py-10 px-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Sign Up</h2>
          <p className="text-sm text-gray-600 mb-6">Create an account to get started.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <label className="text-sm flex items-center gap-2 mt-4">
              <input type="checkbox" required />
              I agree to the{" "}
              <a href="/terms" className="text-indigo-600 underline">Terms</a> and{" "}
              <a href="/privacy" className="text-indigo-600 underline">Privacy Policy</a>
            </label>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base">Create account</Button>
            {error && <p className="text-sm text-red-600 text-center mt-2">{String(error)}</p>}

          </form>

          

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">Login</a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
