"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bot, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/ai/history")
      .then(res => res.json())
      .then(data => setMessages(data.history || []));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      if (!data.reply) throw new Error("AI failed");

      const aiMessage: Message = { role: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      toast.error("Something went wrong while contacting AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-center text-indigo-700">
        🤖 FinSight AI Assistant
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 h-[70vh] overflow-y-auto flex flex-col space-y-4 border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-3 max-w-2xl",
              msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            <div className="p-2 bg-indigo-100 rounded-full">
              {msg.role === "user" ? (
                <UserCircle className="h-6 w-6 text-indigo-600" />
              ) : (
                <Bot className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div
              className={cn(
                "rounded-lg px-4 py-2 text-sm whitespace-pre-line shadow",
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="self-start text-gray-500 text-sm px-4 py-2 bg-gray-100 rounded shadow w-fit">
            Typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-6 flex gap-2">
        <Input
          placeholder="Ask any finance question…"
          className="flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </Button>
      </div>
    </main>
  );
}
