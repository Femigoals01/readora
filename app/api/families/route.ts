
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const families = await prisma.family.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return NextResponse.json({ families });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Family name is required." },
        { status: 400 }
      );
    }

    const family = await prisma.family.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json({ family }, { status: 201 });
  } catch (error) {
    console.error("CREATE_FAMILY_ERROR", error);

    return NextResponse.json(
      { message: "Failed to create family." },
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

    const { familyId } = await req.json();

    if (!familyId) {
      return NextResponse.json(
        { message: "Family ID is required." },
        { status: 400 }
      );
    }

    await prisma.family.deleteMany({
      where: {
        id: familyId,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Family group deleted." });
  } catch (error) {
    console.error("DELETE_FAMILY_ERROR", error);

    return NextResponse.json(
      { message: "Failed to delete family group." },
      { status: 500 }
    );
  }
}