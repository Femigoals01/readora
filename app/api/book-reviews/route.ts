

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

    const { bookSlug, rating, comment } = await req.json();

    if (!bookSlug) {
      return NextResponse.json({ message: "Book slug is required." }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5." }, { status: 400 });
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { message: "Review must be at least 10 characters." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const existingReview = await prisma.bookReview.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: book.id,
        },
      },
    });

    const review = await prisma.bookReview.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: book.id,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId: session.user.id,
        bookId: book.id,
        rating,
        comment,
      },
    });

    if (!existingReview) {
      await awardXP(session.user.id, `Reviewed ${book.title}`, 25);
    }

    return NextResponse.json({
      message: existingReview ? "Review updated." : "Review submitted.",
      review,
    });
  } catch (error) {
    console.error("BOOK_REVIEW_ERROR", error);

    return NextResponse.json(
      { message: "Failed to submit review." },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json(
        { message: "Review ID is required." },
        { status: 400 }
      );
    }

    await prisma.bookReview.deleteMany({
      where: {
        id: reviewId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Review deleted." });
  } catch (error) {
    console.error("DELETE_BOOK_REVIEW_ERROR", error);

    return NextResponse.json(
      { message: "Failed to delete review." },
      { status: 500 }
    );
  }
}