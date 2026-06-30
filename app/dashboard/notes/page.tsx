

import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
    //   <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
        <DashboardShell>
        <Link
          href="/login"
          className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
        >
          Sign In
        </Link>
        </DashboardShell>
      
    );
  }

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      book: {
        include: {
          author: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">Readora Notebook</p>
          <h1 className="mt-3 text-5xl font-black">My Notes</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            All your reading notes collected in one personal knowledge library.
          </p>
        </section>

        <section className="mt-8 space-y-5">
          {notes.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <NotebookPen className="mx-auto text-slate-400" size={52} />
              <h2 className="mt-4 text-2xl font-black text-[#000D24]">
                No notes yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Open a book and save notes while reading.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <article
                key={note.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-bold text-emerald-600">
                      {note.book.title}
                    </p>

                    <h2 className="mt-1 text-xl font-black text-[#000D24]">
                      by {note.book.author?.name || "Unknown Author"}
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">
                    Page {note.page || "N/A"}
                  </span>
                </div>

                <p className="mt-5 leading-8 text-slate-700">{note.content}</p>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400">
                    {note.createdAt.toLocaleDateString()}
                  </p>

                  <Link
                    href={`/reader/${note.book.slug}`}
                    className="rounded-xl bg-[#000D24] px-4 py-2 text-xs font-black text-white"
                  >
                    Open Book
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}