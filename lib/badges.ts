

import { prisma } from "@/lib/prisma";

async function awardBadge(userId: string, badgeName: string, icon: string) {
  const badge = await prisma.badge.upsert({
    where: { name: badgeName },
    update: {},
    create: {
      name: badgeName,
      icon,
    },
  });

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
    update: {},
    create: {
      userId,
      badgeId: badge.id,
    },
  });
}

export async function checkReadingBadges(userId: string) {
  const completedBooks = await prisma.readingProgress.count({
    where: {
      userId,
      completed: true,
    },
  });

  const sessions = await prisma.readingSession.findMany({
    where: { userId },
    select: { pagesRead: true },
  });

//   const totalPages = sessions.reduce(
//     (sum, session) => sum + session.pagesRead,
//     0
//   );

const totalPages = sessions.reduce(
  (sum: number, session: { pagesRead: number }) => sum + session.pagesRead,
  0
);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true },
  });

  if (completedBooks >= 1) {
    await awardBadge(userId, "First Book Completed", "📘");
  }

  if (completedBooks >= 5) {
    await awardBadge(userId, "5 Books Completed", "🏅");
  }

  if (completedBooks >= 10) {
    await awardBadge(userId, "10 Books Completed", "🏆");
  }

  if (totalPages >= 100) {
    await awardBadge(userId, "100 Pages Read", "📖");
  }

  if (totalPages >= 500) {
    await awardBadge(userId, "500 Pages Read", "🔥");
  }

  if ((user?.streak || 0) >= 7) {
    await awardBadge(userId, "7-Day Streak", "🔥");
  }

  if ((user?.streak || 0) >= 30) {
    await awardBadge(userId, "30-Day Streak", "👑");
  }
}