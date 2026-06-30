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

    const { bookSlug, content } = await req.json();

    if (!bookSlug || !content || content.trim().length < 10) {
      return NextResponse.json(
        { message: "Reflection must be at least 10 characters." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const reflection = await prisma.reflection.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
        content,
      },
    });

    await awardXP(session.user.id, `Wrote reflection on ${book.title}`, 40);

    return NextResponse.json({ reflection }, { status: 201 });
  } catch (error) {
    console.error("CREATE_REFLECTION_ERROR", error);

    return NextResponse.json(
      { message: "Failed to save reflection." },
      { status: 500 }
    );
  }
}