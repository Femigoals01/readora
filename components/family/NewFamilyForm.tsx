"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFamilyForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createFamily(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/families", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/dashboard/family");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={createFamily}
      className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
    >
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-black text-[#000D24]">
          Family Name
        </label>

        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Johnson Family"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
        />
      </div>

      <div className="mt-5">
        <label className="text-sm font-black text-[#000D24]">
          Description
        </label>

        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your family's reading goals..."
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
        />
      </div>

      <button
        disabled={loading}
        className="mt-6 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Family"}
      </button>
    </form>
  );
}