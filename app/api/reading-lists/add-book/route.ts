


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { listId, bookSlug } = await req.json();

    if (!listId || !bookSlug) {
      return NextResponse.json(
        { message: "List and book are required." },
        { status: 400 }
      );
    }

    const list = await prisma.readingList.findFirst({
      where: {
        id: listId,
        userId: session.user.id,
      },
    });

    if (!list) {
      return NextResponse.json({ message: "Reading list not found." }, { status: 404 });
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    await prisma.readingListBook.upsert({
      where: {
        readingListId_bookId: {
          readingListId: list.id,
          bookId: book.id,
        },
      },
      update: {},
      create: {
        readingListId: list.id,
        bookId: book.id,
      },
    });

    return NextResponse.json({ message: "Book added to reading list." });
  } catch (error) {
    console.error("ADD_BOOK_TO_READING_LIST_ERROR", error);

    return NextResponse.json(
      { message: "Failed to add book to reading list." },
      { status: 500 }
    );
  }
}