import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookmarks = await prisma.bookmark.findMany({
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
    <DashboardShell>
      <div className="w-full">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">Saved Pages</p>
          <h1 className="mt-3 text-4xl font-black">Bookmarks</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Continue from pages you saved while reading.
          </p>
        </section>

        <section className="mt-8">
          {bookmarks.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Bookmark className="mx-auto text-slate-400" size={52} />
              <h2 className="mt-4 text-2xl font-black text-[#000D24]">
                No bookmarks yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Open a book and bookmark a page.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Link
                  key={bookmark.id}
                  href={`/reader/${bookmark.book.slug}`}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Bookmark size={24} />
                    </div>

                    <div>
                      <p className="font-black text-[#000D24]">
                        {bookmark.book.title}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {bookmark.book.author?.name || "Unknown Author"}
                      </p>

                      <p className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        Page {bookmark.page}
                      </p>

                      {bookmark.note && (
                        <p className="mt-4 text-sm leading-6 text-slate-500">
                          {bookmark.note}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}