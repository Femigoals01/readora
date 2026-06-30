

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

    const { bookSlug, page, note } = await req.json();

    if (!bookSlug || !page) {
      return NextResponse.json(
        { message: "Book and page are required." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
      select: { id: true },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
        page: Number(page),
        note: note || null,
      },
    });

    return NextResponse.json({ bookmark });
  } catch (error) {
    console.error("CREATE_BOOKMARK_ERROR", error);

    return NextResponse.json(
      { message: "Failed to save bookmark." },
      { status: 500 }
    );
  }
}