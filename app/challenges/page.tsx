

import PublicShell from "@/components/layout/PublicShell";
import Link from "next/link";
import {
  Trophy,
  CalendarDays,
  ArrowLeft,
  Target,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const challenges = await prisma.challenge.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
      <PublicShell>
  <div className="px-5 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">
            Reading Challenges
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Grow with purpose.
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Stay consistent, earn XP, unlock badges,
            and build a life-changing reading habit.
          </p>
        </section>

        {challenges.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Target
              className="mx-auto text-slate-400"
              size={50}
            />

            <h2 className="mt-4 text-2xl font-black text-[#000D24]">
              No challenges yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Challenges created by admins will appear here.
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Trophy
                  className="text-amber-500"
                  size={34}
                />

                <h2 className="mt-5 text-2xl font-black text-[#000D24]">
                  {challenge.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {challenge.description}
                </p>

                <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                  Reward: {challenge.rewardXP} XP
                </div>

                <div className="mt-5 text-xs font-bold text-slate-500">
                  Ends:
                  {" "}
                  {new Date(
                    challenge.endDate
                  ).toLocaleDateString()}
                </div>

                <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white">
                  <CalendarDays size={18} />
                  Join Challenge
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
   </div>
</PublicShell>
  );
}