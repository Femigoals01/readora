"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Discussion = {
  id: string;
  message: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
};

export default function DiscussionClient({
  bookSlug,
  initialDiscussions,
}: {
  bookSlug: string;
  initialDiscussions: Discussion[];
}) {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitDiscussion() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookSlug,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to post message.");
        return;
      }

      setDiscussions((items) => [data.discussion, ...items]);
      setMessage("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
            No discussion yet. Be the first to share your thought.
          </p>
        ) : (
          discussions.map((chat) => (
            <div key={chat.id} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-[#000D24]">
                {chat.user.name || chat.user.email.split("@")[0]}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {chat.message}
              </p>
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thought about this book..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
        />

        <button
          onClick={submitDiscussion}
          disabled={loading || !message.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          <Send size={17} />
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </section>
  );
}