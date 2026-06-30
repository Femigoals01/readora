import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listId, bookId } = await req.json();

    await prisma.readingListBook.deleteMany({
      where: {
        readingListId: listId,
        bookId,
        readingList: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      message: "Book removed from list.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to remove book." },
      { status: 500 }
    );
  }
}