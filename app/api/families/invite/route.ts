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

    const { familyId, email } = await req.json();

    if (!familyId || !email) {
      return NextResponse.json(
        { message: "Family and email are required." },
        { status: 400 }
      );
    }

    const family = await prisma.family.findFirst({
      where: {
        id: familyId,
        ownerId: session.user.id,
      },
    });

    if (!family) {
      return NextResponse.json(
        { message: "Only the family owner can invite members." },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No Readora user found with this email." },
        { status: 404 }
      );
    }

    await prisma.familyMember.upsert({
      where: {
        familyId_userId: {
          familyId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        familyId,
        userId: user.id,
        role: "MEMBER",
      },
    });

    return NextResponse.json({ message: "Family member added." });
  } catch (error) {
    console.error("INVITE_FAMILY_MEMBER_ERROR", error);

    return NextResponse.json(
      { message: "Failed to invite family member." },
      { status: 500 }
    );
  }
}