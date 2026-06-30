
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        files: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("GET_BOOKS_ERROR", error);

    return NextResponse.json(
      { message: "Failed to fetch books" },
      { status: 500 }
    );
  }
}