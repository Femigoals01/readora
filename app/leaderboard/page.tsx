




// import Link from "next/link";
// import Image from "next/image";
// import { Trophy, Medal, ArrowLeft, Flame, BookOpen } from "lucide-react";
// import { prisma } from "@/lib/prisma";
// import PublicShell from "@/components/layout/PublicShell";

// export const dynamic = "force-dynamic";

// function getRankBadge(index: number) {
//   if (index === 0) return "🥇";
//   if (index === 1) return "🥈";
//   if (index === 2) return "🥉";
//   return `#${index + 1}`;
// }

// export default async function LeaderboardPage() {

//     const weekStart = new Date();
// weekStart.setDate(weekStart.getDate() - 7);

//   const readers = await prisma.user.findMany({
//     where: {
//       role: "READER",
//     },
//     orderBy: {
//       readingXp: "desc",
//     },
//     take: 50,
//     include: {
//       readingProgress: true,
//       readingSessions: true,
//       badges: {
//         include: {
//           badge: true,
//         },
//       },
//     },
//   });


//   const weeklyReadersRaw = await prisma.user.findMany({
//   where: {
//     role: "READER",
//     readingSessions: {
//       some: {
//         startedAt: {
//           gte: weekStart,
//         },
//       },
//     },
//   },
//   include: {
//     readingSessions: {
//       where: {
//         startedAt: {
//           gte: weekStart,
//         },
//       },
//     },
//     readingProgress: true,
//   },
// });

// const weeklyReaders = weeklyReadersRaw
//   .map((reader) => ({
//     ...reader,
//     weeklyPages: reader.readingSessions.reduce(
//       (sum, session) => sum + session.pagesRead,
//       0
//     ),
//   }))
//   .sort((a, b) => b.weeklyPages - a.weeklyPages)
//   .slice(0, 10);

//   return (
//     <PublicShell>
//       <div className="px-5 py-8 md:px-8">
//         <div className="mx-auto max-w-5xl">
//           <Link
//             href="/"
//             className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//           >
//             <ArrowLeft size={18} />
//             Back Home
//           </Link>

//           <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl md:p-10">
//             <div className="flex items-center gap-4">
//               <Image
//                 src="/readoralogo.png"
//                 alt="Readora"
//                 width={54}
//                 height={54}
//                 className="rounded-2xl"
//               />

//               <div>
//                 <p className="font-bold text-emerald-300">Readora Rankings</p>
//                 <h1 className="text-4xl font-black md:text-5xl">
//                   Top Readers Leaderboard
//                 </h1>
//               </div>
//             </div>

//             <p className="mt-5 max-w-2xl text-slate-300">
//               Readers are ranked by reading XP, completed books, pages read,
//               streaks, and earned badges.
//             </p>
//           </section>

//           <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
//             <div className="mb-6 flex items-center gap-3">
//               <Trophy className="text-amber-500" />
//               <h2 className="text-2xl font-black text-[#000D24]">
//                 Leaderboard
//               </h2>
//             </div>

//             {readers.length === 0 ? (
//               <div className="rounded-2xl bg-slate-50 p-8 text-center">
//                 <Medal className="mx-auto text-slate-400" size={44} />
//                 <h3 className="mt-4 text-xl font-black">No readers yet</h3>
//                 <p className="mt-2 text-sm text-slate-500">
//                   Readers will appear here once they start earning XP.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {readers.map((reader, index) => {
//                   const displayName =
//                     reader.name || reader.email.split("@")[0] || "Reader";

//                   const completedBooks = reader.readingProgress.filter(
//                     (item) => item.completed
//                   ).length;

//                   const pagesRead = reader.readingSessions.reduce(
//                     (sum, session) => sum + session.pagesRead,
//                     0
//                   );

//                   return (
//                     <div
//                       key={reader.id}
//                       className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
//                         index < 3
//                           ? "border-amber-200 bg-amber-50"
//                           : "border-slate-200 bg-white"
//                       }`}
//                     >
//                       <div className="flex items-start gap-4">
//                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#000D24] text-lg font-black text-white">
//                           {getRankBadge(index)}
//                         </div>

//                         <div>
//                           <p className="font-black text-[#000D24]">
//                             {displayName}
//                           </p>

//                           <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
//                             <span className="inline-flex items-center gap-1">
//                               <BookOpen size={13} />
//                               {completedBooks} books
//                             </span>

//                             <span>•</span>

//                             <span>{pagesRead} pages</span>

//                             <span>•</span>

//                             <span className="inline-flex items-center gap-1">
//                               <Flame size={13} />
//                               {reader.streak} day streak
//                             </span>
//                           </div>

//                           {reader.badges.length > 0 && (
//                             <div className="mt-2 flex flex-wrap gap-1">
//                               {reader.badges.slice(0, 3).map((item) => (
//                                 <span
//                                   key={item.id}
//                                   className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-amber-700"
//                                 >
//                                   {item.badge.name}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="text-left sm:text-right">
//                         <p className="text-xl font-black text-emerald-600">
//                           {reader.readingXp.toLocaleString()}
//                         </p>
//                         <p className="text-xs font-bold text-slate-400">XP</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>


//           <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
//   <div className="mb-6 flex items-center gap-3">
//     <Flame className="text-orange-500" />
//     <h2 className="text-2xl font-black text-[#000D24]">
//       Weekly Leaderboard
//     </h2>
//   </div>

//   {weeklyReaders.length === 0 ? (
//     <div className="rounded-2xl bg-slate-50 p-8 text-center">
//       <Medal className="mx-auto text-slate-400" size={44} />
//       <h3 className="mt-4 text-xl font-black">No weekly activity yet</h3>
//       <p className="mt-2 text-sm text-slate-500">
//         Readers will appear here after reading this week.
//       </p>
//     </div>
//   ) : (
//     <div className="space-y-3">
//       {weeklyReaders.map((reader, index) => {
//         const displayName =
//           reader.name || reader.email.split("@")[0] || "Reader";

//         return (
//           <div
//             key={reader.id}
//             className={`flex items-center justify-between rounded-2xl border p-4 ${
//               index < 3
//                 ? "border-orange-200 bg-orange-50"
//                 : "border-slate-200 bg-white"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000D24] text-lg font-black text-white">
//                 {getRankBadge(index)}
//               </div>

//               <div>
//                 <p className="font-black text-[#000D24]">
//                   {displayName}
//                 </p>

//                 <p className="text-xs font-semibold text-slate-500">
//                   {reader.weeklyPages} pages read this week
//                 </p>
//               </div>
//             </div>

//             <p className="text-sm font-bold text-orange-600">
//               {reader.weeklyPages} pages
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   )}
// </section>
//         </div>
//       </div>
//     </PublicShell>
//   );
// }




import Link from "next/link";
import Image from "next/image";
import { Trophy, Medal, ArrowLeft, Flame, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PublicShell from "@/components/layout/PublicShell";

export const dynamic = "force-dynamic";

type ReadingProgressItem = {
  id: string;
  completed: boolean;
};

type ReadingSessionItem = {
  id: string;
  pagesRead: number;
};

type ReaderBadgeItem = {
  id: string;
  badge: {
    name: string;
  };
};

type ReaderItem = {
  id: string;
  name: string | null;
  email: string;
  streak: number;
  readingXp: number;
  readingProgress: ReadingProgressItem[];
  readingSessions: ReadingSessionItem[];
  badges: ReaderBadgeItem[];
};

type WeeklyReaderItem = {
  id: string;
  name: string | null;
  email: string;
  weeklyPages: number;
  readingSessions: ReadingSessionItem[];
  readingProgress: ReadingProgressItem[];
};

function getRankBadge(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `#${index + 1}`;
}

export default async function LeaderboardPage() {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const readers = (await prisma.user.findMany({
    where: {
      role: "READER",
    },
    orderBy: {
      readingXp: "desc",
    },
    take: 50,
    include: {
      readingProgress: true,
      readingSessions: true,
      badges: {
        include: {
          badge: true,
        },
      },
    },
  })) as ReaderItem[];

  const weeklyReadersRaw = (await prisma.user.findMany({
    where: {
      role: "READER",
      readingSessions: {
        some: {
          startedAt: {
            gte: weekStart,
          },
        },
      },
    },
    include: {
      readingSessions: {
        where: {
          startedAt: {
            gte: weekStart,
          },
        },
      },
      readingProgress: true,
    },
  })) as Omit<WeeklyReaderItem, "weeklyPages">[];

  const weeklyReaders = weeklyReadersRaw
    .map((reader) => ({
      ...reader,
      weeklyPages: reader.readingSessions.reduce(
        (sum: number, session: ReadingSessionItem) => sum + session.pagesRead,
        0
      ),
    }))
    .sort((a: WeeklyReaderItem, b: WeeklyReaderItem) => b.weeklyPages - a.weeklyPages)
    .slice(0, 10);

  return (
    <PublicShell>
      <div className="px-5 py-8 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
          >
            <ArrowLeft size={18} />
            Back Home
          </Link>

          <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl md:p-10">
            <div className="flex items-center gap-4">
              <Image
                src="/readoralogo.png"
                alt="Readora"
                width={54}
                height={54}
                className="rounded-2xl"
              />

              <div>
                <p className="font-bold text-emerald-300">Readora Rankings</p>
                <h1 className="text-4xl font-black md:text-5xl">
                  Top Readers Leaderboard
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-slate-300">
              Readers are ranked by reading XP, completed books, pages read,
              streaks, and earned badges.
            </p>
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="text-amber-500" />
              <h2 className="text-2xl font-black text-[#000D24]">
                Leaderboard
              </h2>
            </div>

            {readers.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <Medal className="mx-auto text-slate-400" size={44} />
                <h3 className="mt-4 text-xl font-black">No readers yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Readers will appear here once they start earning XP.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {readers.map((reader: ReaderItem, index: number) => {
                  const displayName =
                    reader.name || reader.email.split("@")[0] || "Reader";

                  const completedBooks = reader.readingProgress.filter(
                    (item: ReadingProgressItem) => item.completed
                  ).length;

                  const pagesRead = reader.readingSessions.reduce(
                    (sum: number, session: ReadingSessionItem) =>
                      sum + session.pagesRead,
                    0
                  );

                  return (
                    <div
                      key={reader.id}
                      className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                        index < 3
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#000D24] text-lg font-black text-white">
                          {getRankBadge(index)}
                        </div>

                        <div>
                          <p className="font-black text-[#000D24]">
                            {displayName}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <BookOpen size={13} />
                              {completedBooks} books
                            </span>

                            <span>•</span>

                            <span>{pagesRead} pages</span>

                            <span>•</span>

                            <span className="inline-flex items-center gap-1">
                              <Flame size={13} />
                              {reader.streak} day streak
                            </span>
                          </div>

                          {reader.badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {reader.badges
                                .slice(0, 3)
                                .map((item: ReaderBadgeItem) => (
                                  <span
                                    key={item.id}
                                    className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-amber-700"
                                  >
                                    {item.badge.name}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xl font-black text-emerald-600">
                          {reader.readingXp.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-slate-400">XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <Flame className="text-orange-500" />
              <h2 className="text-2xl font-black text-[#000D24]">
                Weekly Leaderboard
              </h2>
            </div>

            {weeklyReaders.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center">
                <Medal className="mx-auto text-slate-400" size={44} />
                <h3 className="mt-4 text-xl font-black">
                  No weekly activity yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Readers will appear here after reading this week.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyReaders.map((reader: WeeklyReaderItem, index: number) => {
                  const displayName =
                    reader.name || reader.email.split("@")[0] || "Reader";

                  return (
                    <div
                      key={reader.id}
                      className={`flex items-center justify-between rounded-2xl border p-4 ${
                        index < 3
                          ? "border-orange-200 bg-orange-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000D24] text-lg font-black text-white">
                          {getRankBadge(index)}
                        </div>

                        <div>
                          <p className="font-black text-[#000D24]">
                            {displayName}
                          </p>

                          <p className="text-xs font-semibold text-slate-500">
                            {reader.weeklyPages} pages read this week
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-orange-600">
                        {reader.weeklyPages} pages
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  );
}