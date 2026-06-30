



import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  Award,
  BookOpen,
  Bot,
  Home,
  Library,
  Medal,
  MessageSquareText,
  NotebookPen,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  ListChecks,
} from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function DashboardSidebar() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "My Library", href: "/dashboard/my-library", icon: BookOpen },
    { label: "Reading Lists", href: "/dashboard/reading-lists", icon: ListChecks },
    { label: "Browse Library", href: "/library", icon: Library },
    { label: "Notes", href: "/dashboard/notes", icon: NotebookPen },
    { label: "Reflections", href: "/dashboard/reflections", icon: MessageSquareText },
    { label: "Badges", href: "/dashboard/badges", icon: Medal },
    { label: "Certificates", href: "/dashboard/certificates", icon: Award },
    { label: "Challenges", href: "/challenges", icon: Target },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "AI Coach", href: "/dashboard/ai-coach", icon: Bot },
    { label: "Family Reading", href: "/dashboard/family", icon: Users },
  ];

  return (
    // <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-5 lg:block">
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-white p-5">
      <div className="sticky top-24">
        <p className="mb-4 px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Reader Menu
        </p>

        <nav className="grid gap-2">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {role === "ADMIN" && (
            <Link
              href="/admin"
              className="mt-4 flex items-center gap-3 rounded-2xl bg-[#000D24] px-4 py-3 text-sm font-black text-white"
            >
              <ShieldCheck size={18} />
              Admin Control
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
}

