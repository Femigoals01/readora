import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { listId, public: isPublic } = await req.json();

    if (!listId) {
      return NextResponse.json(
        { message: "Reading list ID is required." },
        { status: 400 }
      );
    }

    const list = await prisma.readingList.updateMany({
      where: {
        id: listId,
        userId: session.user.id,
      },
      data: {
        public: Boolean(isPublic),
      },
    });

    if (list.count === 0) {
      return NextResponse.json(
        { message: "Reading list not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: Boolean(isPublic)
        ? "Reading list is now public."
        : "Reading list is now private.",
    });
  } catch (error) {
    console.error("TOGGLE_READING_LIST_PUBLIC_ERROR", error);

    return NextResponse.json(
      { message: "Failed to update reading list visibility." },
      { status: 500 }
    );
  }
}