


import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { message } = await req.json();

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!message || message.trim().length < 2) {
            return NextResponse.json(
                { message: "Please ask a question." },
                { status: 400 }
            );
        }

        const currentProgress = await prisma.readingProgress.findFirst({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                book: {
                    include: {
                        author: true,
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });

        const completedBooks = await prisma.readingProgress.findMany({
            where: {
                userId: session.user.id,
                completed: true,
            },
            orderBy: {
                completedAt: "desc",
            },
            take: 5,
            include: {
                book: {
                    include: {
                        author: true,
                    },
                },
            },
        });


        const recentNotes = await prisma.note.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                book: true,
            },
        });

        const recentReflections = await prisma.reflection.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                book: true,
            },
        });

        const currentBookContext = currentProgress
            ? `
Current book:
- Title: ${currentProgress.book.title}
- Author: ${currentProgress.book.author?.name || "Unknown Author"}
- Current page: ${currentProgress.currentPage}
- Progress: ${Math.round(currentProgress.percentage)}%
- Categories: ${currentProgress.book.categories
                // .map((item) => item.category.name)
                .map((item: { category: { name: string } }) => item.category.name)
                .join(", ")}
`
            : "The user has not started a book yet.";

        const completedBooksContext =
            completedBooks.length > 0
                ? completedBooks
                    // .map(
                    //     (item, index) =>
                    //         `${index + 1}. ${item.book.title} by ${item.book.author?.name || "Unknown Author"
                    //         }`
                    // )
                    .map(
  (
    item: { book: { title: string; author: { name: string } | null } },
    index: number
  ) =>
    `${index + 1}. ${item.book.title} by ${
      item.book.author?.name || "Unknown Author"
    }`
)
                    .join("\n")
                : "No completed books yet.";


                const notesContext =
  recentNotes.length > 0
    ? recentNotes
        .map(
          (note, index) =>
            `${index + 1}. ${note.book.title}: ${note.content}`
        )
        .join("\n")
    : "No notes yet.";

const reflectionsContext =
  recentReflections.length > 0
    ? recentReflections
        .map(
          (reflection, index) =>
            `${index + 1}. ${reflection.book.title}: ${reflection.content}`
        )
        .join("\n")
    : "No reflections yet.";

        const prompt = `
You are Readora AI Coach, a warm, practical reading mentor.

Use the user's reading context below to answer personally.

${currentBookContext}

Recently completed books:
${completedBooksContext}

Recent notes:
${notesContext}

Recent reflections:
${reflectionsContext}

Recent notes:
${notesContext}

Recent reflections:
${reflectionsContext}

User question:
${message}

Give a clear, helpful and practical answer.
`;

        try {
            const response = await openai.responses.create({
                model: "gpt-5.5",
                instructions:
                    "You are Readora AI Coach. Be warm, clear, practical, and concise. Help the reader understand books, build consistency, create summaries, reflection questions, and reading plans.",
                input: prompt,
            });

            return NextResponse.json({
                response: response.output_text || "No response generated.",
            });
        } catch {
            return NextResponse.json({
                response: `
I cannot access the live AI service right now, but here is a helpful coaching response based on your Readora activity:

${currentBookContext}

Recently completed books:
${completedBooksContext}

For your question: "${message}"

Try this:
1. Write one key lesson from your current book.
2. Connect it to your life, family, work, or spiritual growth.
3. Read for 20 minutes today.
4. Write one reflection after reading.
5. Continue from page ${currentProgress?.currentPage || 1}.
`,
            });
        }
    } catch (error) {
        console.error("AI_COACH_CONTEXT_ERROR", error);

        return NextResponse.json(
            { message: "Failed to generate AI coach response." },
            { status: 500 }
        );
    }
}