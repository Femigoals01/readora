

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { familyId, memberId } = await req.json();

    if (!familyId || !memberId) {
      return NextResponse.json(
        { message: "Family and member are required." },
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
        { message: "Only the family owner can remove members." },
        { status: 403 }
      );
    }

    const member = await prisma.familyMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { message: "Family member not found." },
        { status: 404 }
      );
    }

    if (member.userId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot remove yourself as the family owner." },
        { status: 400 }
      );
    }

    await prisma.familyMember.delete({
      where: {
        id: memberId,
      },
    });

    return NextResponse.json({ message: "Family member removed." });
  } catch (error) {
    console.error("REMOVE_FAMILY_MEMBER_ERROR", error);

    return NextResponse.json(
      { message: "Failed to remove family member." },
      { status: 500 }
    );
  }
}