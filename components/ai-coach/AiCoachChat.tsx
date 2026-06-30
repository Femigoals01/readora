


"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

const samplePrompts = [
  "Summarize my current reading progress",
  "Give me reflection questions from my current book",
  "Create a 7-day reading plan based on my progress",
  "What should I focus on from my recent notes?",
  "How can I stay consistent this week?",
];

function generateCoachResponse(question: string) {
    return `Great question. Here is a helpful reading-coach response:

1. Start by identifying the main lesson from what you read.
2. Write down one sentence that summarizes the idea.
3. Ask yourself: “How does this apply to my life today?”
4. Choose one small action you can practice immediately.

Your question was: “${question}”

As Readora grows, this coach can later connect to real AI and give deeper answers from books, chapters, notes and your reading history.`;
}

export default function AiCoachChat() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    // function askCoach(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault();

    //     if (!question.trim()) return;

    //     setLoading(true);

    //     setTimeout(() => {
    //         setResponse(generateCoachResponse(question));
    //         setLoading(false);
    //     }, 700);
    // }

    async function askCoach(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!question.trim()) return;

  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("/api/ai-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: question,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setResponse(data.message || "Something went wrong.");
      return;
    }

    setResponse(data.response);
  } catch {
    setResponse("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

    return (
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
                <Bot className="text-emerald-600" size={34} />
                <h2 className="text-2xl font-black text-[#000D24]">
                    Ask Readora Coach
                </h2>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
                {samplePrompts.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => setQuestion(prompt)}
                        className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-left text-sm font-bold text-slate-700 transition hover:bg-emerald-50"
                    >
                        <Sparkles size={16} className="text-amber-500" />
                        {prompt}
                    </button>
                ))}
            </div>

            <form onSubmit={askCoach} className="mt-6">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={5}
                    placeholder="Ask your reading coach..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />

                <button
                    disabled={loading}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white disabled:opacity-60"
                >
                    <Send size={16} />
                    {loading ? "Thinking..." : "Ask Coach"}
                </button>
            </form>

            {response && (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-5">
                    <p className="whitespace-pre-line text-sm font-semibold leading-7 text-slate-700">
                        {response}
                    </p>
                </div>
            )}
        </section>
    );
}