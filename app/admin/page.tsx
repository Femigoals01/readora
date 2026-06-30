



import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Link from "next/link";
import {
  BookOpen,
  Upload,
  Users,
  BarChart3,
  Trophy,
  FileText,
  Headphones,
  Video,
  Plus,
} from "lucide-react";

const stats = [
  { label: "Total Books", value: "500+", icon: BookOpen },
  { label: "Readers", value: "8,000+", icon: Users },
  { label: "Downloads", value: "21k+", icon: FileText },
  { label: "Avg. Reading Time", value: "42h", icon: BarChart3 },
];

export default async function AdminPage() {

    const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  redirect("/login");
}

if (session.user.role !== "ADMIN") {
  redirect("/dashboard");
}
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold text-emerald-600">Admin Portal</p>
            <h1 className="text-4xl font-black text-[#000D24]">
              Readora Control Centre
            </h1>
          </div>

          <Link
            href="/admin/books/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
          >
            <Plus size={18} />
            Upload New Book
          </Link>
        </header>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon size={24} />
                </div>
                <p className="text-4xl font-black text-[#000D24]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">Content Management</h2>
              <Upload className="text-emerald-600" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Books", "Manage books, PDFs and EPUB files", BookOpen],
                ["Audiobooks", "Upload and manage MP3 resources", Headphones],
                ["Videos", "Upload MP4 teaching videos", Video],
                ["Documents", "Manuals, guides and devotionals", FileText],
              ].map(([title, desc, Icon]) => (
                <Link
                  key={String(title)}
                  href="/admin/books"
                  className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Icon className="text-emerald-600" size={24} />
                  <h3 className="mt-4 font-black">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {String(desc)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#000D24] p-7 text-white shadow-2xl">
            <Trophy className="text-amber-400" size={34} />
            <h2 className="mt-5 text-2xl font-black">Top Readers</h2>

            <div className="mt-6 space-y-4">
              {["Esther — 124 Books", "John — 119 Books", "David — 108 Books"].map(
                (reader, index) => (
                  <div
                    key={reader}
                    className="flex items-center justify-between rounded-2xl bg-white/8 p-4"
                  >
                    <span className="font-bold">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {reader}
                    </span>
                    <span className="text-sm font-bold text-emerald-300">
                      View
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-black">Reading Analytics</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Most Popular Book", "Atomic Habits"],
              ["Most Active Category", "Personal Growth"],
              ["Least Active Members", "213"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#000D24]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}