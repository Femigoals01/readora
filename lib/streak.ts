


// import { prisma } from "@/lib/prisma";

// function isSameDay(a: Date, b: Date) {
//   return a.toDateString() === b.toDateString();
// }

// function isYesterday(lastDate: Date, today: Date) {
//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);

//   return isSameDay(lastDate, yesterday);
// }

// export async function updateReadingStreak(userId: string) {
//   const today = new Date();

//   const lastSession = await prisma.readingSession.findFirst({
//     where: { userId },
//     orderBy: { startedAt: "desc" },
//   });

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { streak: true },
//   });

//   if (!user) return;

//   if (!lastSession) {
//     await prisma.user.update({
//       where: { id: userId },
//       data: { streak: 1 },
//     });

//     return;
//   }

//   if (isSameDay(lastSession.startedAt, today)) return;

//   if (isYesterday(lastSession.startedAt, today)) {
//     await prisma.user.update({
//       where: { id: userId },
//       data: {
//         streak: {
//           increment: 1,
//         },
//       },
//     });

//     return;
//   }

//   await prisma.user.update({
//     where: { id: userId },
//     data: { streak: 1 },
//   });
// }




import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function updateReadingStreak(userId: string) {
  const today = new Date();

  const todaySession = await prisma.readingSession.findFirst({
    where: {
      userId,
      startedAt: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true },
  });

  if (!user) return;

  if (todaySession && user.streak < 1) {
    await prisma.user.update({
      where: { id: userId },
      data: { streak: 1 },
    });
    return;
  }

  if (!todaySession) {
    await prisma.user.update({
      where: { id: userId },
      data: { streak: 1 },
    });
  }
}