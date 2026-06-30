


import { prisma } from "@/lib/prisma";

export async function awardXP(
  userId: string,
  activity: string,
  points: number
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: {
        increment: points,
      },
    },
    select: {
      xp: true,
    },
  });

  await prisma.xPHistory.create({
    data: {
      userId,
      activity,
      points,
    },
  });

  const unlockedBadges = await prisma.badge.findMany({
    where: {
      requiredXP: {
        lte: user.xp,
      },
    },
  });

  for (const badge of unlockedBadges) {
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

  return user.xp;
}