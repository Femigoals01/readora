





import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight, BookOpen, Bookmark } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UnsaveBookButton from "@/components/books/UnsaveBookButton";

export const dynamic = "force-dynamic";

type ProgressItem = {
  id: string;
  bookId: string;
  currentPage: number;
  percentage: number;
  book: {
    title: string;
    slug: string;
    coverImage: string | null;
    author: {
      name: string;
    } | null;
    categories: {
      category: {
        id: string;
        name: string;
      };
    }[];
  };
};

type SavedBookItem = {
  id: string;
  bookId: string;
  book: ProgressItem["book"];
};

type BookCategoryItem = {
  category: {
    id: string;
    name: string;
  };
};

export default async function MyLibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#000D24]">
            Please sign in
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            You need to sign in to view your reading journey.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
          >
            Sign In
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const progress = await prisma.readingProgress.findMany({
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
          files: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  const savedBooks = await prisma.savedBook.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      book: {
        include: {
          author: true,
          files: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

//   const readingBookIds = new Set(progress.map((item) => item.bookId));

const readingBookIds = new Set(
  progress.map((item: ProgressItem) => item.bookId)
);

//   const savedOnlyBooks = savedBooks.filter(
//     (item) => !readingBookIds.has(item.bookId)
//   );

const savedOnlyBooks = savedBooks.filter(
  (item: SavedBookItem) => !readingBookIds.has(item.bookId)
);

  const hasAnyBooks = progress.length > 0 || savedOnlyBooks.length > 0;

  return (
    <DashboardShell>
      <div className="w-full">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold text-emerald-600">Dashboard</p>
            <h1 className="text-4xl font-black text-[#000D24]">My Library</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Continue reading books you started and access books you saved.
            </p>
          </div>

          <Link
            href="/library"
            className="rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
          >
            Browse Library
          </Link>
        </header>

        {!hasAnyBooks ? (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto text-slate-400" size={52} />
            <h2 className="mt-4 text-2xl font-black text-[#000D24]">
              Your library is empty
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start reading or save any book and it will appear here.
            </p>
            <Link
              href="/library"
              className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
            >
              Browse Books
            </Link>
          </section>
        ) : (
          <div className="space-y-10">
            <section>
              <div className="mb-5 flex items-center gap-3">
                <BookOpen className="text-emerald-600" />
                <h2 className="text-2xl font-black text-[#000D24]">
                  Continue Reading
                </h2>
              </div>

              {progress.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">
                    You have not started reading any book yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {/* {progress.map((item) => { */}
                  {progress.map((item: ProgressItem) => {
                    const book = item.book;

                    return (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="aspect-[3/4] w-full rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-[#000D24] p-5 text-center text-white">
                            <h3 className="text-2xl font-black leading-tight">
                              {book.title}
                            </h3>
                          </div>
                        )}

                        <div className="pt-4">
                          <h3 className="font-black text-[#000D24]">
                            {book.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {book.author?.name || "Unknown Author"}
                          </p>

                          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>Page {item.currentPage}</span>
                            <span>{Math.round(item.percentage)}%</span>
                          </div>

                          <div className="mt-2 h-2 rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-emerald-400"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>

                          <Link
                            href={`/reader/${book.slug}`}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
                          >
                            Continue Reading
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <Bookmark className="text-amber-500" />
                <h2 className="text-2xl font-black text-[#000D24]">
                  Saved Books
                </h2>
              </div>

              {savedOnlyBooks.length === 0 ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">
                    Books you save before reading will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {/* {savedOnlyBooks.map((item) => { */}
                  {savedOnlyBooks.map((item: SavedBookItem) => {
                    const book = item.book;

                    return (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="aspect-[3/4] w-full rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-[#000D24] p-5 text-center text-white">
                            <h3 className="text-2xl font-black leading-tight">
                              {book.title}
                            </h3>
                          </div>
                        )}

                        <div className="pt-4">
                          <h3 className="font-black text-[#000D24]">
                            {book.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {book.author?.name || "Unknown Author"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {/* {book.categories.map((item) => ( */}

                            {book.categories.map((item: BookCategoryItem) => (
                              <span
                                key={item.category.id}
                                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
                              >
                                {item.category.name}
                              </span>
                            ))}
                          </div>

                          <Link
                            href={`/library/${book.slug}`}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
                          >
                            View Book
                            <ArrowRight size={16} />
                          </Link>

                          <UnsaveBookButton bookSlug={book.slug} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}