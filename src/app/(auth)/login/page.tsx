"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  console.log('log in button clicked');

  try {
    console.log('api call');
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log(res.status);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }
    console.log('redirecting');
    router.push("/dashboard");
  } 
  //eslint-disable-next-line
  catch (err: any) {
    setError(err.message || "Something went wrong");
    console.log('error', err);
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
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Login</h2>
          <p className="text-sm text-gray-600 mb-6">Enter your email to access your account.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base">Sign in</Button>
            {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
