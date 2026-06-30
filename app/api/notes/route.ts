import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      bookSlug,
      page,
      content,
    } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { message: "Note cannot be empty." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: {
        slug: bookSlug,
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: "Book not found." },
        { status: 404 }
      );
    }

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
        page,
        content,
      },
    });

    await awardXP(
      session.user.id,
      `Created a note`,
      10
    );

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to save note." },
      { status: 500 }
    );
  }
}