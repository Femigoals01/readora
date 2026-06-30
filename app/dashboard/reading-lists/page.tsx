import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { BookOpen, ListChecks, Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReadingListsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#000D24]">Please sign in</h1>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
          >
            Sign In
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const lists = await prisma.readingList.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      books: {
        include: {
          book: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  });

  return (
    <DashboardShell>
      <div className="w-full">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold text-emerald-600">Collections</p>
            <h1 className="text-4xl font-black text-[#000D24]">
              My Reading Lists
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Organize books into personal collections and reading plans.
            </p>
          </div>

          <Link
            href="/dashboard/reading-lists/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
          >
            <Plus size={18} />
            New List
          </Link>
        </header>

        {lists.length === 0 ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <ListChecks className="mx-auto text-slate-400" size={52} />
            <h2 className="mt-4 text-2xl font-black text-[#000D24]">
              No reading lists yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your first list for books you want to read, study, or share.
            </p>
            <Link
              href="/dashboard/reading-lists/new"
              className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
            >
              Create List
            </Link>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/dashboard/reading-lists/${list.id}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <BookOpen size={26} />
                </div>

                <h2 className="mt-5 text-2xl font-black text-[#000D24]">
                  {list.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {list.description || "No description yet."}
                </p>

                <p className="mt-5 text-sm font-black text-emerald-600">
                  {list.books.length} book(s)
                </p>
              </Link>
            ))}
          </section>
        )}
      </div>
    </DashboardShell>
  );
}