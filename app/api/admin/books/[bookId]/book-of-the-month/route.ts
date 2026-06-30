

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await params;

    await prisma.$transaction([
      prisma.book.updateMany({
        data: {
          isBookOfTheMonth: false,
        },
      }),

      prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isBookOfTheMonth: true,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Book of the Month updated successfully.",
    });
  } catch (error) {
    console.error("BOOK_OF_THE_MONTH_ERROR", error);

    return NextResponse.json(
      { message: "Failed to update Book of the Month." },
      { status: 500 }
    );
  }
}