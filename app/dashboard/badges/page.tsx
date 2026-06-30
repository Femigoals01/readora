

// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { ArrowLeft, Award } from "lucide-react";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import DashboardShell from "@/components/layout/DashboardShell";

// export const dynamic = "force-dynamic";

// export default async function BadgesPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return (
//     //   <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
//         <DashboardShell>
//         <Link
//           href="/login"
//           className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
//         >
//           Sign In
//         </Link>
//       </DashboardShell>
//     );
//   }

//   const badges = await prisma.badge.findMany({
//     orderBy: {
//       requiredXP: "asc",
//     },
//   });

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     include: {
//       badges: {
//         include: {
//           badge: true,
//         },
//       },
//     },
//   });

//   const earnedBadgeIds = new Set(user?.badges.map((item) => item.badgeId));

//   return (
//     <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
//       <div className="mx-auto max-w-5xl">
//         <Link
//           href="/dashboard"
//           className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//         >
//           <ArrowLeft size={18} />
//           Back to Dashboard
//         </Link>

//         <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//           <p className="font-bold text-emerald-300">Achievements</p>
//           <h1 className="mt-3 text-5xl font-black">Reading Badges</h1>
//           <p className="mt-3 max-w-2xl text-slate-300">
//             Earn badges as you read, complete books, grow your XP, and stay consistent.
//           </p>
//         </section>

//         <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {badges.map((badge) => {
//             const earned = earnedBadgeIds.has(badge.id);

//             return (
//               <div
//                 key={badge.id}
//                 className={`rounded-3xl border p-6 shadow-sm ${
//                   earned
//                     ? "border-emerald-200 bg-emerald-50"
//                     : "border-slate-200 bg-white opacity-70"
//                 }`}
//               >
//                 <div className="text-5xl">{badge.icon || "🏅"}</div>

//                 <h3 className="mt-5 text-xl font-black text-[#000D24]">
//                   {badge.name}
//                 </h3>

//                 <p className="mt-2 text-sm leading-6 text-slate-600">
//                   {badge.description || "Keep reading to unlock this badge."}
//                 </p>

//                 <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700">
//                   {earned
//                     ? "Unlocked"
//                     : `${badge.requiredXP || 0} XP required`}
//                 </div>
//               </div>
//             );
//           })}
//         </section>
//       </div>
//     </main>
//   );
// }


import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowLeft, Award, Lock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

export default async function BadgesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
          >
            Sign In
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const badges = await prisma.badge.findMany({
    orderBy: [{ requiredXP: "asc" }, { createdAt: "asc" }],
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
    },
  });

  const earnedBadgeIds = new Set(user?.badges.map((item) => item.badgeId));
  const unlockedCount = user?.badges.length || 0;

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
          <p className="font-bold text-emerald-300">Achievements</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Reading Badges
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Earn badges as you read, complete books, grow your XP, and stay
            consistent.
          </p>

          <div className="mt-6 inline-flex rounded-2xl bg-white/10 px-5 py-3 text-sm font-black">
            {unlockedCount} / {badges.length} unlocked
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const earned = earnedBadgeIds.has(badge.id);

            return (
              <div
                key={badge.id}
                className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm ${
                  earned
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white opacity-80"
                }`}
              >
                {!earned && (
                  <div className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 text-slate-400">
                    <Lock size={16} />
                  </div>
                )}

                <div className="text-5xl">{badge.icon || "🏅"}</div>

                <h3 className="mt-5 text-xl font-black text-[#000D24]">
                  {badge.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {badge.description || "Keep reading to unlock this badge."}
                </p>

                <div
                  className={`mt-5 rounded-2xl px-4 py-3 text-sm font-black ${
                    earned
                      ? "bg-white text-emerald-700"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  {earned
                    ? "Unlocked"
                    : badge.requiredXP
                    ? `${badge.requiredXP} XP required`
                    : "Milestone badge"}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </DashboardShell>
  );
}