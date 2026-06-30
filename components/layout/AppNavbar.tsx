


import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AppNavbar() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#000D24]/95 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/readoralogo.png"
            alt="Readora"
            width={38}
            height={38}
            priority
            className="rounded-xl"
          />
          <span className="text-xl font-black">Readora</span>
        </Link>

        <div className="hidden items-center gap-7 text-xs font-bold text-slate-200 lg:flex">
          <Link href="/">Home</Link>
          <Link href="/library">Library</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/leaderboard">Leaderboard</Link>

          {session?.user && (
            <Link href="/dashboard">Dashboard</Link>
          )}

          {role === "ADMIN" && (
            <Link href="/admin" className="text-emerald-300">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!session?.user ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-xl border border-white/25 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 sm:inline-flex"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-black text-[#000D24] transition hover:bg-emerald-300"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-black text-[#000D24] transition hover:bg-emerald-300"
            >
              My Dashboard
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}