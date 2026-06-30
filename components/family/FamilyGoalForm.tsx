
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Target } from "lucide-react";

export default function FamilyGoalForm({ familyId }: { familyId: string }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [targetBooks, setTargetBooks] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/families/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId,
          title,
          targetBooks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create goal.");
        return;
      }

      setTitle("");
      setTargetBooks(1);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={createGoal}
      className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3">
        <Target className="text-emerald-600" size={28} />
        <div>
          <h2 className="text-xl font-black text-[#000D24]">
            Family Reading Goal
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Set a goal for your family to achieve together.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-[1fr_160px_auto]">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Read 3 books this month"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
        />

        <input
          type="number"
          min={1}
          value={targetBooks}
          onChange={(e) => setTargetBooks(Number(e.target.value))}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
        />

        <button
          disabled={loading}
          className="rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </div>
    </form>
  );
}