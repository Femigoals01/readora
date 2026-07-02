


import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { BookOpen, LayoutDashboard, Library, ShieldCheck } from "lucide-react";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function DashboardNav() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    // <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <header className="sticky top-0 z-50 hidden border-b border-slate-200 bg-white/90 backdrop-blur lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="/readoralogo.png"
            alt="Readora"
            width={38}
            height={38}
            priority
            className="rounded-xl"
          />
          <span className="text-xl font-black text-[#000D24]">Readora</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 md:flex">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link href="/dashboard/my-library" className="flex items-center gap-2">
            <BookOpen size={17} />
            My Library
          </Link>

          <Link href="/library" className="flex items-center gap-2">
            <Library size={17} />
            Browse
          </Link>

          {role === "ADMIN" && (
            <Link href="/admin" className="flex items-center gap-2">
              <ShieldCheck size={17} />
              Admin
            </Link>
          )}
        </nav>

        <LogoutButton />
      </div>
    </header>
  );
}