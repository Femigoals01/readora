



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { awardXP } from "@/lib/xp";
import { updateReadingStreak } from "@/lib/streak";
import { checkReadingBadges } from "@/lib/badges";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookSlug, currentPage, totalPages } = body;

    if (!bookSlug || !currentPage || !totalPages) {
      return NextResponse.json(
        { message: "Book slug, current page and total pages are required." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const oldProgress = await prisma.readingProgress.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: book.id,
        },
      },
    });

    const previousPage = oldProgress?.currentPage || 0;
    const newPage = Number(currentPage);
    const pagesGained = Math.max(0, newPage - previousPage);

    const percentage = Math.min(
      100,
      Math.round((newPage / Number(totalPages)) * 100)
    );

    const wasCompleted = oldProgress?.completed || false;
    const isCompleted = percentage >= 100;

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: book.id,
        },
      },
      update: {
        currentPage: newPage,
        percentage,
        completed: isCompleted,
        completedAt: isCompleted ? oldProgress?.completedAt || new Date() : null,
      },
      create: {
        userId: session.user.id,
        bookId: book.id,
        currentPage: newPage,
        percentage,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    if (!oldProgress) {
      await awardXP(session.user.id, "Opened book", 5);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          readingXp: {
            increment: 5,
          },
        },
      });
    }

    await prisma.readingSession.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
        pagesRead: pagesGained,
        minutesRead: 1,
      },
    });

    await updateReadingStreak(session.user.id);
    await checkReadingBadges(session.user.id);

    if (pagesGained >= 10) {
      const points = Math.floor(pagesGained / 10) * 20;

      await awardXP(session.user.id, `Read ${pagesGained} pages`, points);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          readingXp: {
            increment: points,
          },
        },
      });
    }

    if (!wasCompleted && isCompleted) {
      await awardXP(session.user.id, `Finished ${book.title}`, 200);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          readingXp: {
            increment: 200,
          },
        },
      });
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("SAVE_READING_PROGRESS_ERROR", error);

    return NextResponse.json(
      { message: "Failed to save reading progress." },
      { status: 500 }
    );
  }
}