

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { bookSlug } = await req.json();

//     if (!bookSlug) {
//       return NextResponse.json(
//         { message: "Book slug is required." },
//         { status: 400 }
//       );
//     }

//     const book = await prisma.book.findUnique({
//       where: { slug: bookSlug },
//     });

//     if (!book) {
//       return NextResponse.json({ message: "Book not found." }, { status: 404 });
//     }

//     const savedBook = await prisma.savedBook.upsert({
//       where: {
//         userId_bookId: {
//           userId: session.user.id,
//           bookId: book.id,
//         },
//       },
//       update: {},
//       create: {
//         userId: session.user.id,
//         bookId: book.id,
//       },
//     });

//     return NextResponse.json({
//       message: "Book saved successfully.",
//       savedBook,
//     });
//   } catch (error) {
//     console.error("SAVE_BOOK_ERROR", error);

//     return NextResponse.json(
//       { message: "Failed to save book." },
//       { status: 500 }
//     );
//   }
// }



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

    const { bookSlug } = await req.json();

    if (!bookSlug) {
      return NextResponse.json(
        { message: "Book slug is required." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    await prisma.savedBook.upsert({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: book.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        bookId: book.id,
      },
    });

    return NextResponse.json({ message: "Book saved successfully." });
  } catch (error) {
    console.error("SAVE_BOOK_ERROR", error);

    return NextResponse.json(
      { message: "Failed to save book." },
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

    const { bookSlug } = await req.json();

    if (!bookSlug) {
      return NextResponse.json(
        { message: "Book slug is required." },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    await prisma.savedBook.deleteMany({
      where: {
        userId: session.user.id,
        bookId: book.id,
      },
    });

    return NextResponse.json({ message: "Book removed from saved books." });
  } catch (error) {
    console.error("UNSAVE_BOOK_ERROR", error);

    return NextResponse.json(
      { message: "Failed to remove saved book." },
      { status: 500 }
    );
  }
}