

import Link from "next/link";
import { getServerSession } from "next-auth";
import { Award, ArrowLeft, Download } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
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

  const completedBooks = await prisma.readingProgress.findMany({
    where: {
      userId: session.user.id,
      completed: true,
    },
    orderBy: {
      completedAt: "desc",
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
          <p className="font-bold text-emerald-300">Achievements</p>
          <h1 className="mt-3 text-5xl font-black">My Certificates</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Certificates are awarded when you complete books, series, quizzes,
            and learning challenges.
          </p>
        </section>

        <section className="mt-8">
          {completedBooks.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Award className="mx-auto text-slate-400" size={52} />
              <h2 className="mt-4 text-2xl font-black text-[#000D24]">
                No certificates yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Complete a book to unlock your first certificate.
              </p>
              <Link
                href="/library"
                className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
              >
                Start Reading
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {completedBooks.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Award size={34} />
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-[#000D24]">
                    Certificate of Completion
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Awarded for completing{" "}
                    <span className="font-black">{item.book.title}</span> by{" "}
                    {item.book.author?.name || "Unknown Author"}.
                  </p>

                  <p className="mt-4 text-xs font-bold text-slate-400">
                    Completed:{" "}
                    {item.completedAt
                      ? item.completedAt.toLocaleDateString()
                      : "Recently"}
                  </p>

                  <Link
                    href={`/dashboard/certificates/${item.book.slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
                  >
                    <Download size={18} />
                    View Certificate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}