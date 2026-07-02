




import DashboardShell from "@/components/layout/DashboardShell";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import {
    ArrowRight,
    Award,
    BookOpen,
    Bot,
    Clock,
    Flame,
    Library,
    Medal,
    MessageSquareText,
    NotebookPen,
    Star,
    Target,
    Trophy,
    Users,
    ListChecks,
    Bookmark
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProgressItem = {
  id: string;
  bookId: string;
  currentPage: number;
  percentage: number;
  completed: boolean;
  book: {
    title: string;
    slug: string;
    coverImage: string | null;
    pages: number | null;
    author: { name: string } | null;
    categories: { categoryId: string }[];
  };
};

type CategoryItem = {
  categoryId: string;
};

type ReadingSessionItem = {
  minutesRead: number;
};

type BadgeItem = {
  badge: {
    id: string;
    name: string;
    icon: string | null;
  };
};

type RecommendedBookItem = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  featured: boolean;
  isBookOfTheMonth: boolean;
  author: { name: string } | null;
  categories: { categoryId: string }[];
};

type RecommendedBookWithScore = RecommendedBookItem & {
  matchScore: number;
  reason: string;
};


const dashboardLinks = [
    {
        title: "My Library",
        description: "Continue books you have started.",
        href: "/dashboard/my-library",
        icon: BookOpen,
    },
    {
        title: "Reading Lists",
        description: "Organize books into collections.",
        href: "/dashboard/reading-lists",
        icon: ListChecks,
    },
    {
        title: "My Notes",
        description: "View all your saved reading notes.",
        href: "/dashboard/notes",
        icon: NotebookPen,
    },
    {
        title: "Reflections",
        description: "Review what each book taught you.",
        href: "/dashboard/reflections",
        icon: MessageSquareText,
    },
    {
        title: "Badges",
        description: "Track your reading achievements.",
        href: "/dashboard/badges",
        icon: Medal,
    },
    {
        title: "Certificates",
        description: "View completed-book certificates.",
        href: "/dashboard/certificates",
        icon: Award,
    },
    {
        title: "Leaderboard",
        description: "See top readers on Readora.",
        href: "/leaderboard",
        icon: Trophy,
    },
    {
        title: "Challenges",
        description: "Join reading challenges.",
        href: "/challenges",
        icon: Target,
    },
    {
        title: "AI Coach",
        description: "Ask questions and get summaries.",
        href: "/dashboard/ai-coach",
        icon: Bot,
    },
    {
        title: "Family Reading",
        description: "Create family groups, invite members, set goals, and track progress together.",
        href: "/dashboard/family",
        icon: Users,
    },

    {
  title: "Bookmarks",
  description: "Return to pages you saved.",
  href: "/dashboard/bookmarks",
  icon: Bookmark,
}
];

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
                <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-black text-[#000D24]">
                        Please sign in
                    </h1>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
                    >
                        Sign In
                    </Link>
                </div>
            </main>
        );
    }

    const progress = await prisma.readingProgress.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        include: {
            book: {
                include: {
                    author: true,
                    files: true,
                    categories: true,
                },
            },
        },
    });

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            xp: true,
            streak: true,
        },
    });

    const sessions = await prisma.readingSession.findMany({
        where: {
            userId: session.user.id,
        },
    });

    const badges = await prisma.userBadge.findMany({
        where: {
            userId: session.user.id,
        },
        take: 4,
        orderBy: {
            earnedAt: "desc",
        },
        include: {
            badge: true,
        },
    });

   


    const categoryIds = [
        ...new Set(
          
            progress.flatMap((item: ProgressItem) =>
  item.book.categories?.map((categoryItem: CategoryItem) => categoryItem.categoryId) || []
)
        ),
    ];

   


    let recommendedBooks = await prisma.book.findMany({
        where: {
            status: "PUBLISHED",
            ...(categoryIds.length > 0
                ? {
                    categories: {
                        some: {
                            categoryId: {
                                in: categoryIds,
                            },
                        },
                    },
                }
                : {}),
            id: {
                notIn: progress.map((item: ProgressItem) => item.bookId),
            },
        },
        take: 3,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: true,
            categories: true,
        },
    });

    if (recommendedBooks.length === 0) {
        recommendedBooks = await prisma.book.findMany({
            where: {
                status: "PUBLISHED",
                id: {
                    notIn: progress.map((item: ProgressItem) => item.bookId),
                },
            },
            take: 2,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                author: true,
                categories: true,
            },
        });
    }

  

    const recommendedBooksWithScore = recommendedBooks.map((book: RecommendedBookItem) => {
        const matchingCategories =
            book.categories?.filter((item: CategoryItem) =>
                categoryIds.includes(item.categoryId)
            ).length || 0;

        const matchScore =
            categoryIds.length > 0
                ? Math.min(98, 70 + matchingCategories * 10)
                : 80;

        let reason = "Recommended for all readers";

        if (matchingCategories >= 2) {
            reason = "Matches your favorite categories";
        } else if (matchingCategories === 1) {
            reason = "Based on books you've been reading";
        } else if (book.featured) {
            reason = "Featured by Readora";
        } else if (book.isBookOfTheMonth) {
            reason = "Book of the Month";
        }

        return {
            ...book,
            matchScore,
            reason,
        };
    });

    const totalMinutesRead = sessions.reduce(
        (sum: number, item: ReadingSessionItem) => sum + item.minutesRead,
        0
    );

    const hoursReading = Math.round(totalMinutesRead / 60);
    const booksStarted = progress.length;
    const booksCompleted = progress.filter((item: ProgressItem) => item.completed).length;
    const pagesRead = progress.reduce((sum: number, item: ProgressItem) => sum + item.currentPage, 0);
    const currentBook = progress[0];

    const firstName = session.user.name?.split(" ")[0] || "Reader";

    return (
        <DashboardShell>
            <div className="w-full">




                {/* <header className="mb-8 grid gap-4 md:grid-cols-2 "> */}
                {/* <header className="mb-8 grid gap-4 md:grid-cols-2"> */}
                <header className="mb-6">
                    <div>
                        {/* <h1 className="text-4xl font-black text-[#000D24]"> */}
                        <h1 className="text-3xl font-black leading-tight text-[#000D24] sm:text-4xl">
                            Good morning,  {firstName}! 👋
                        </h1>

                        <p className="mt-2 font-semibold text-slate-500">
                            Let&apos;s make today a great reading day.
                        </p>
                    </div>

                    {/* <div className="grid md:grid-cols-2 gap-2"> */}

                    {/* <div className="grid grid-cols-2 gap-2 max-[420px]:grid-cols-1"> */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center ">
                            <div className="flex items-center gap-3">
                                <Flame className="text-orange-500" />
                                <div>
                                    <p className="text-2xl font-black text-[#000D24]">
                                        {user?.streak || 0}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">
                                        Day Streak
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center">
                            <div className="flex items-center gap-3">
                                <Star className="text-amber-500" />
                                <div>
                                    <p className="text-2xl font-black text-[#000D24]">
                                        {user?.xp || 0}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">
                                        XP Points
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>



                {/* <section className="grid gap-5 md:grid-cols-2"> */}
                <section className="grid gap-4 lg:grid-cols-2">
                    {/* TODAY'S GOAL */}
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm ">
                        {/* <div className="grid h-full items-center gap- sm:grid-cols-[1fr_170px] grid-cols-2"> */}
                        {/* <div className="grid h-full grid-cols-2 items-center gap-4 max-[420px]:grid-cols-1"> */}
                        <div className="grid h-full grid-cols-2 items-center gap-4 max-[420px]:grid-cols-1">
                            <div>
                                <h2 className="text-base font-black text-[#000D24]">
                                    Today&apos;s Goal
                                </h2>

                                <p className="mt-4 text-sm font-black">Read for 20 minutes</p>

                                <div className="mt-4 h-2 rounded-full bg-slate-100">
                                    <div className="h-2 w-[60%] rounded-full bg-emerald-400" />
                                </div>

                                <p className="mt-3 text-xs font-bold text-slate-500">
                                    12 min / 20 min
                                </p>

                                <Link
                                    href={currentBook ? `/reader/${currentBook.book.slug}` : "/library"}
                                    className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-xs font-black text-[#000D24]"
                                >
                                    Continue Reading
                                </Link>
                            </div>

                            <div>
                                <Image
                                    src="/contreading.png"
                                    alt="Continue reading"
                                    width={170}
                                    height={170}
                                    priority
                                    className="mx-auto"
                                />
                            </div>


                        </div>
                    </div>

                    {/* CURRENT BOOK */}
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-black text-[#000D24]">Current Book</h2>

                        {currentBook ? (
                            // <div className="mt-4 flex items-center  grid grid-cols-2">
                            // <div className="mt-4 grid grid-cols-2 items-center gap-4 max-[420px]:grid-cols-1">
                            <div className="mt-4 flex flex-col gap-5 sm:grid sm:grid-cols-2 sm:items-center">
                                <div className="flex h-36 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#000D24] text-center text-white">
                                    {currentBook.book.coverImage ? (
                                        <img
                                            src={currentBook.book.coverImage}
                                            alt={currentBook.book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <p className="p-2 text-xs font-black">{currentBook.book.title}</p>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-black leading-tight text-[#000D24]">
                                        {currentBook.book.title}
                                    </h3>

                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                        {currentBook.book.author?.name || "Unknown Author"}
                                    </p>

                                   

                                    <p className="mt-4 text-xs font-bold text-slate-500">
                                        Page {currentBook.currentPage}
                                        {currentBook.book.pages ? ` of ${currentBook.book.pages}` : ""}
                                    </p>

                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="h-2 flex-1 rounded-full bg-slate-100">
                                            <div
                                                className="h-2 rounded-full bg-emerald-400"
                                                style={{ width: `${currentBook.percentage}%` }}
                                            />
                                        </div>

                                        <span className="text-xs font-black text-slate-500">
                                            {Math.round(currentBook.percentage)}%
                                        </span>
                                    </div>

                                    <Link
                                        href={`/reader/${currentBook.book.slug}`}
                                        className="mt-4 inline-flex items-center gap-2 text-xs font-black text-emerald-600"
                                    >
                                        Continue Reading <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                                <p className="text-sm font-bold text-slate-500">No current book yet.</p>

                                <Link
                                    href="/library"
                                    className="mt-4 inline-flex rounded-xl bg-[#000D24] px-5 py-3 text-xs font-black text-white"
                                >
                                    Browse Library
                                </Link>
                            </div>
                        )}
                    </div>
                </section>


                <section className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#000D24]">
                                Your Progress
                            </h2>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                                This Month
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Books Started", value: booksStarted, icon: BookOpen },
                                { label: "Completed", value: booksCompleted, icon: Trophy },
                                { label: "Pages Read", value: pagesRead, icon: Library },
                                { label: "Hours", value: hoursReading, icon: Clock },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
                                        <Icon className="text-emerald-600" size={18} />
                                        <p className="mt-3 text-xl font-black text-[#000D24]">
                                            {item.value}
                                        </p>
                                        <p className="mt-1 text-[10px] font-bold text-slate-500">
                                            {item.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex h-32 items-end gap-2 rounded-2xl bg-emerald-50 p-4">
                            {[22, 38, 31, 55, 45, 70, 52, 80].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex-1 rounded-t-xl bg-emerald-400"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#000D24]">Badges</h2>

                            <Link
                                href="/dashboard/badges"
                                className="text-xs font-black text-slate-500"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {(badges.length
                                ? badges
                                : [
                                    { badge: { id: "first", name: "First Book", icon: "📘" } },
                                    { badge: { id: "five", name: "5 Books", icon: "🏅" } },
                                    { badge: { id: "streak", name: "Streak 7", icon: "🔥" } },
                                    { badge: { id: "gold", name: "Gold Reader", icon: "⭐" } },
                                ]
                            ).map((item: BadgeItem) => (
                                <div
                                    key={item.badge.id}
                                    className="rounded-2xl bg-slate-50 p-4 text-center"
                                >
                                    <div className="text-4xl">{item.badge.icon || "🏅"}</div>
                                    <p className="mt-3 text-xs font-black text-[#000D24]">
                                        {item.badge.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#000D24]">
                                Recommended For You
                            </h2>

                            <Link href="/library" className="text-xs font-black text-slate-500">
                                View All
                            </Link>
                        </div>

                        {/* <div className="space-y-4"> */}
                        <div className="flex gap-4 overflow-x-auto pb-2 lg:block lg:space-y-4">
                            {/* {recommendedBooks.map((book, index) => ( */}
                            {/* {recommendedBooksWithScore.map((book) => ( */}
                            {recommendedBooksWithScore.map((book: RecommendedBookWithScore) => (
                                <Link
                                    key={book.id}
                                    href={`/library/${book.slug}`}
                                    // className="flex gap-4 rounded-2xl bg-slate-50 p-3"
                                    className="min-w-[270px] rounded-2xl bg-slate-50 p-3 flex gap-4 lg:min-w-0"
                                >
                                    <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#000D24] text-center text-white">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <BookOpen size={20} />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-black text-[#000D24]">{book.title}</p>

                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                            {book.author?.name || "Unknown Author"}
                                        </p>

                                       <p className="mt-2 text-[11px] font-bold text-emerald-600">
  {book.reason}
</p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-xs font-black text-emerald-600">
                                                {book.matchScore}% Match
                                            </p>

                                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                                                For You
                                            </span>
                                        </div>

                                        <div className="mt-1 h-2 rounded-full bg-white">
                                            <div
                                                className="h-2 rounded-full bg-emerald-400"
                                                // style={{ width: `${95 - index * 3}%` }}
                                                style={{ width: `${book.matchScore}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <div className="mb-5">
                        <p className="text-sm font-bold text-emerald-600">
                            Readora Tools
                        </p>

                        <h2 className="text-2xl font-black text-[#000D24]">
                            Everything for your reading growth
                        </h2>
                    </div>

                    {/* <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"> */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {/* {dashboardLinks.map((item) => { */}
                        {dashboardLinks.map((item: (typeof dashboardLinks)[number]) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-[#000D24] group-hover:text-white">
                                        <Icon size={24} />
                                    </div>

                                    <h3 className="text-xl font-black text-[#000D24]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {item.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </DashboardShell>
    );
}