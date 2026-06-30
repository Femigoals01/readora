
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function InviteFamilyMemberForm({
  familyId,
}: {
  familyId: string;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function inviteMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/families/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add member.");
        return;
      }

      setMessage("Family member added successfully.");
      setEmail("");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={inviteMember}
      className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3">
        <UserPlus className="text-emerald-600" size={28} />
        <div>
          <h2 className="text-xl font-black text-[#000D24]">
            Invite Family Member
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Add an existing Readora user by email.
          </p>
        </div>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@email.com"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
        />

        <button
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          <UserPlus size={18} />
          {loading ? "Adding..." : "Add Member"}
        </button>
      </div>
    </form>
  );
}