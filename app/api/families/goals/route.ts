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

    const { familyId, title, targetBooks } = await req.json();

    if (!familyId || !title || !targetBooks) {
      return NextResponse.json(
        { message: "Family, title and target books are required." },
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
        { message: "Only the family owner can create goals." },
        { status: 403 }
      );
    }

    const goal = await prisma.familyGoal.create({
      data: {
        familyId,
        title,
        targetBooks: Number(targetBooks),
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error("CREATE_FAMILY_GOAL_ERROR", error);

    return NextResponse.json(
      { message: "Failed to create family goal." },
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

    const { goalId } = await req.json();

    if (!goalId) {
      return NextResponse.json(
        { message: "Goal ID is required." },
        { status: 400 }
      );
    }

    const goal = await prisma.familyGoal.findUnique({
      where: { id: goalId },
      include: { family: true },
    });

    if (!goal || goal.family.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: "Only the family owner can delete this goal." },
        { status: 403 }
      );
    }

    await prisma.familyGoal.delete({
      where: { id: goalId },
    });

    return NextResponse.json({ message: "Goal deleted." });
  } catch (error) {
    console.error("DELETE_FAMILY_GOAL_ERROR", error);

    return NextResponse.json(
      { message: "Failed to delete goal." },
      { status: 500 }
    );
  }
}