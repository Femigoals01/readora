

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookSlug, message } = await req.json();

    if (!bookSlug || !message || message.trim().length < 3) {
      return NextResponse.json(
        { message: "Message is too short." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
        message,
      },
      include: {
        user: true,
      },
    });

    await awardXP(session.user.id, `Joined discussion on ${book.title}`, 15);

    return NextResponse.json({ discussion }, { status: 201 });
  } catch (error) {
    console.error("CREATE_DISCUSSION_ERROR", error);

    return NextResponse.json(
      { message: "Failed to post discussion." },
      { status: 500 }
    );
  }
}