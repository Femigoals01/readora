"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewReadingListForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reading-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create list.");
        return;
      }

      router.push("/dashboard/reading-lists");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={createList}
      className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
    >
      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <label className="text-sm font-black text-[#000D24]">List Name</label>
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Prayer Books"
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      />

      <label className="mt-5 block text-sm font-black text-[#000D24]">
        Description
      </label>
      <textarea
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What is this list for?"
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      />

      <button
        disabled={loading}
        className="mt-6 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create List"}
      </button>
    </form>
  );
}