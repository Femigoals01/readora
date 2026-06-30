


import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/layout/PublicShell";
import SaveBookButton from "@/components/books/SaveBookButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BookReviewForm from "@/components/books/BookReviewForm";
import DeleteReviewButton from "@/components/books/DeleteReviewButton";
import AddToReadingListButton from "@/components/reading-lists/AddToReadingListButton";
import {
    ArrowLeft,
    BookOpen,
    Download,
    Headphones,
    PlayCircle,
    Bookmark,
    Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const book = await prisma.book.findUnique({
        where: { slug },
        include: {
            author: true,
            files: true,
            categories: {
                include: {
                    category: true,
                },
            },

            reviews: {
  orderBy: {
    createdAt: "desc",
  },
  include: {
    user: true,
  },
},
        },
    });

    if (!book) notFound();

    const mainFile = book.files[0];

    const averageRating =
    
  book.reviews.length > 0
    ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
      book.reviews.length
    : 0;


     const session = await getServerSession(authOptions);

    const userReview = session?.user?.id
  ? book.reviews.find((review) => review.userId === session.user.id)
  : null;

   

const savedBook = session?.user?.id
  ? await prisma.savedBook.findFirst({
      where: {
        userId: session.user.id,
        bookId: book.id,
      },
    })
  : null;



    return (
        <PublicShell>
            <div className="px-5 py-8 md:px-8">
                <div className="mx-auto max-w-7xl">

                    <Link
                        href="/library"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Library
                    </Link>

                    <section className="grid gap-8 rounded-[2rem] bg-[#000D24] p-6 text-white shadow-2xl md:p-10 lg:grid-cols-[360px_1fr]">
                        <div className="rounded-[1.5rem] bg-white/10 p-5">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="aspect-[3/4] w-full rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-amber-100 p-8 text-center text-[#000D24]">
                                    <h1 className="text-4xl font-black leading-tight">
                                        {book.title}
                                    </h1>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                {book.categories.map((item) => (
                                    <span
                                        key={item.category.id}
                                        className="rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-300"
                                    >
                                        {item.category.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl font-black md:text-6xl">{book.title}</h1>

                            <p className="mt-3 text-lg font-semibold text-slate-300">
                                by {book.author?.name || "Unknown Author"}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
                                {book.files.map((file) => (
                                    <span
                                        key={file.id}
                                        className="rounded-full bg-white/10 px-4 py-2"
                                    >
                                        {file.fileType}
                                    </span>
                                ))}

                                {book.pages && (
                                    <span className="rounded-full bg-white/10 px-4 py-2">
                                        {book.pages} Pages
                                    </span>
                                )}

                               
                                <span className="rounded-full bg-white/10 px-4 py-2">
  {averageRating > 0 ? averageRating.toFixed(1) : "No"} Rating
</span>
                            </div>

                            <p className="mt-7 max-w-3xl leading-8 text-slate-300">
                                {book.description || "No description available yet."}
                            </p>

                            {/* <div className="mt-8 flex flex-wrap gap-4"> */}

                            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">
                                <Link
                                    href={`/reader/${book.slug}`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-black text-[#000D24]"
                                >
                                    <BookOpen size={18} />
                                    Start Reading
                                </Link>

                                {/* {mainFile && ( */}

                                {mainFile?.fileUrl && (
                                    <a
                                        href={mainFile.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-[#000D24]"
                                    >
                                        <Download size={18} />
                                        Download
                                    </a>
                                )}

                                {/* <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-black text-white">
                                    <Bookmark size={18} />
                                    Save
                                </button> */}

                                {/* <SaveBookButton bookSlug={book.slug} /> */}
                                <SaveBookButton bookSlug={book.slug} initiallySaved={!!savedBook} />
                                <AddToReadingListButton bookSlug={book.slug} />

                                <Link
                                    href={`/library/${book.slug}/discussion`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-sm font-black text-[#000D24]"
                                >
                                    Discussion
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="mt-10 grid gap-6 lg:grid-cols-3">

                        <Link
  href={`/reader/${book.slug}`}
  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <BookOpen className="text-emerald-600" />
                            <h3 className="mt-4 text-xl font-black">Read Online</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Continue reading from where you stopped.
                            </p>
                        </div>

</Link>


                        {book.files.some((f) => f.fileType === "MP3") && (

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <Headphones className="text-emerald-600" />
                            <h3 className="mt-4 text-xl font-black">Audio Version</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Listen while commuting, working, or resting.
                            </p>
                        </div>
                        )}


                        {book.files.some((f) => f.fileType === "MP4") && (

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <PlayCircle className="text-emerald-600" />
                            <h3 className="mt-4 text-xl font-black">Teaching Videos</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Watch lessons connected to this book.
                            </p>
                        </div>
                        )}
                    </section>



                    {/* <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                        <h2 className="text-2xl font-black">Reader Reviews</h2>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {[
                                "Very practical and life-changing.",
                                "Easy to follow.",
                                "Helped me build discipline.",
                            ].map((review) => (
                                <div key={review} className="rounded-2xl bg-slate-50 p-5">
                                    <div className="mb-3 flex text-amber-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600">
                                        “{review}”
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section> */}


                    <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h2 className="text-2xl font-black">Reader Reviews</h2>
      <p className="mt-1 text-sm font-semibold text-slate-500">
        {book.reviews.length} review(s) • {averageRating.toFixed(1)} average rating
      </p>
    </div>
  </div>

  {/* <BookReviewForm bookSlug={book.slug} /> */}
  <BookReviewForm
  bookSlug={book.slug}
  existingReview={
    userReview
      ? {
          rating: userReview.rating,
          comment: userReview.comment,
        }
      : null
  }
/>

  <div className="mt-8 grid gap-4 md:grid-cols-3">
    {book.reviews.length === 0 ? (
      <div className="rounded-2xl bg-slate-50 p-5 md:col-span-3">
        <p className="text-sm font-semibold text-slate-500">
          No reviews yet. Be the first to review this book.
        </p>
      </div>
    ) : (
      book.reviews.map((review) => (
        <div key={review.id} className="rounded-2xl bg-slate-50 p-5">
          <div className="mb-3 flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                fill={star <= review.rating ? "currentColor" : "none"}
              />
            ))}
          </div>

          <p className="text-sm font-semibold text-slate-600">
            “{review.comment}”
          </p>

          <p className="mt-4 text-xs font-black text-slate-400">
            {review.user.name || review.user.email.split("@")[0]}
          </p>

          {session?.user?.id === review.userId && (
  <DeleteReviewButton reviewId={review.id} />
)}
        </div>
      ))
    )}
  </div>
</section>
                </div>
            </div>
        </PublicShell>
    );
}




