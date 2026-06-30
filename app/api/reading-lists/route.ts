

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const lists = await prisma.readingList.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     include: {
//       books: {
//         include: {
//           book: true,
//         },
//       },
//     },
//   });

//   return NextResponse.json({ lists });
// }

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const { name, description } = await req.json();

//   if (!name || name.trim().length < 2) {
//     return NextResponse.json(
//       { message: "List name is required." },
//       { status: 400 }
//     );
//   }

//   const list = await prisma.readingList.create({
//     data: {
//       userId: session.user.id,
//       name,
//       description,
//     },
//   });

//   return NextResponse.json({ list }, { status: 201 });
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const lists = await prisma.readingList.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      books: {
        include: {
          book: true,
        },
      },
    },
  });

  return NextResponse.json({ lists });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { message: "List name is required." },
      { status: 400 }
    );
  }

  const list = await prisma.readingList.create({
    data: {
      userId: session.user.id,
      name,
      description,
    },
  });

  return NextResponse.json({ list }, { status: 201 });
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { listId } = await req.json();

    if (!listId) {
      return NextResponse.json(
        { message: "Reading list ID is required." },
        { status: 400 }
      );
    }

    await prisma.readingList.deleteMany({
      where: {
        id: listId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Reading list deleted." });
  } catch (error) {
    console.error("DELETE_READING_LIST_ERROR", error);

    return NextResponse.json(
      { message: "Failed to delete reading list." },
      { status: 500 }
    );
  }
}