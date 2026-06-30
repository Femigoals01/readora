

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create account.");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-black text-[#000D24]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BookOpen size={22} />
          </span>
          Readora
        </Link>

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-black text-[#000D24]">
            Create your account
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Start your reading journey today.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#000D24] px-5 py-4 text-sm font-black text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-black text-emerald-600">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}