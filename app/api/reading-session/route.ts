

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      bookId,
      pagesRead,
      minutesRead,
    } = body;

    const readingSession =
      await prisma.readingSession.create({
        data: {
          userId: session.user.id,
          bookId,
          pagesRead,
          minutesRead,
        },
      });

    return NextResponse.json(readingSession);
  } catch {
    return NextResponse.json(
      { message: "Failed" },
      { status: 500 }
    );
  }
}