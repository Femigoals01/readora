

import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowLeft, Star } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default async function XPPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
        <Link
          href="/login"
          className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true },
  });

  const history = await prisma.xPHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    // <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">

        <DashboardShell>
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">Readora Score</p>
          <h1 className="mt-3 text-5xl font-black">{user?.xp || 0} XP</h1>
          <p className="mt-3 text-slate-300">
            Your XP grows as you read, complete books, write reflections and join challenges.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#000D24]">XP History</h2>

          <div className="mt-6 space-y-3">
            {history.length === 0 ? (
              <p className="text-sm font-semibold text-slate-500">
                No XP earned yet. Start reading to earn your first points.
              </p>
            ) : (
            //   history.map((item) => (

            history.map((item: {
  id: string;
  activity: string;
  points: number;
  createdAt: Date;
}) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <Star size={20} />
                    </div>
                    <div>
                      <p className="font-black text-[#000D24]">
                        {item.activity}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {item.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg font-black text-emerald-600">
                    +{item.points} XP
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}