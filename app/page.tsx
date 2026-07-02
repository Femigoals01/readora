




import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  Headphones,
  Users,
  Trophy,
  Play,
  Flame,
  Heart,
  BarChart3,
  TrendingUp,
  Brain,
  GraduationCap,
  Sprout,
  Star,
  Mail,

} from "lucide-react";

const categories = [
  { name: "Leadership", icon: Trophy },
  { name: "Prayer", icon: Flame },
  { name: "Business", icon: BarChart3 },
  { name: "Finance", icon: TrendingUp },
  { name: "Marriage", icon: Heart },
  { name: "Personal Growth", icon: Sprout },
  { name: "AI & Tech", icon: Brain },
  { name: "Education", icon: GraduationCap },
];

type ReviewItem = {
  rating: number;
};

type FeaturedBookItem = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  author: {
    name: string;
  } | null;
  reviews: ReviewItem[];
};

type ReadingSessionItem = {
  pagesRead: number;
};

type ReadingProgressItem = {
  completed: boolean;
};

type TopReaderItem = {
  id: string;
  name: string | null;
  readingXp: number;
  readingProgress: ReadingProgressItem[];
};

type WeeklyReaderItem = {
  id: string;
  name: string | null;
  readingSessions: ReadingSessionItem[];
};

type WeeklyReaderWithPages = WeeklyReaderItem & {
  weeklyPages: number;
};

type BookCategoryItem = {
  category: {
    id: string;
    name: string;
  };
};



export default async function HomePage() {


  const allFeaturedBooks = await prisma.book.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      author: true,
      files: true,
      reviews: true,
    },
  });

  const featuredBooks = (allFeaturedBooks as FeaturedBookItem[])
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  // const recommendedBooks = await prisma.book.findMany({
  //   where: {
  //     status: "PUBLISHED",
  //   },
  //   take: 5,
  //   include: {
  //     author: true,
  //     reviews: true,
  //   },
  // });


  const recommendedBooks = await prisma.book.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      author: true,
      reviews: true,
    },
  });





  const bookOfTheMonth = await prisma.book.findFirst({
    where: {
      status: "PUBLISHED",
      isBookOfTheMonth: true,
    },
    include: {
      author: true,
      files: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });




  const topReaders = await prisma.user.findMany({
    where: {
      role: "READER",
    },
    orderBy: {
      readingXp: "desc",
    },
    take: 3,
    include: {
      readingProgress: true,
      readingSessions: true,
      badges: {
        include: {
          badge: true,
        },
      },
    },
  });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const weeklyReadersRaw = await prisma.user.findMany({
    where: {
      role: "READER",
      readingSessions: {
        some: {
          startedAt: {
            gte: weekStart,
          },
        },
      },
    },
    include: {
      readingSessions: {
        where: {
          startedAt: {
            gte: weekStart,
          },
        },
      },
    },
  });

  const weeklyTopReaders = weeklyReadersRaw
    .map((reader: WeeklyReaderItem) => ({
      ...reader,
      weeklyPages: reader.readingSessions.reduce(
        (sum: number, session: ReadingSessionItem) => sum + session.pagesRead,
        0
      ),
    }))
    .sort((a: WeeklyReaderWithPages, b: WeeklyReaderWithPages) => b.weeklyPages - a.weeklyPages)
    .slice(0, 3);


  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950 readora-soft-grid">
      {/* HERO */}
      {/* HERO */}
      <section className="relative overflow-hidden rounded-b-[2.5rem] bg-[#000D24] text-white shadow-2xl">
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">


          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/readoralogo.png"
              alt="Readora Logo"
              width={42}
              height={42}
              priority
              className="h-10 w-10 object-contain"
            />

            <span className="text-2xl font-black text-white">
              Readora
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-semibold text-slate-200 lg:flex">
            <Link href="/">Home</Link>
            <Link href="/library">Library</Link>
            <Link href="#categories">Categories</Link>
            <Link href="#challenge">Challenges</Link>
            <Link href="#leaderboard">Leaderboard</Link>
            <Link href="#about">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-white/25 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-black text-[#000D24] shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </div>
        </nav>





        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-5 pb-12 pt-8 md:px-8 lg:grid-cols-2 lg:pb-14 lg:pt-8">
          {/* MOBILE/TABLET BACKGROUND IMAGE ONLY */}
          <div className="pointer-events-none absolute inset-0 z-0 block lg:!hidden">
            <Image
              src="/readorahero4.png"
              alt="Readora Hero Background"
              fill
              priority
              className="object-cover object-center opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#000D24]/78" />
          </div>

          {/* LEFT TEXT */}
          <div className="relative z-10 max-w-xl">
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Read. Learn.
              <span className="mt-2 block text-emerald-400">Grow.</span>
            </h1>

            <div className="mt-3 h-3 w-32 rounded-full bg-amber-400" />

            <p className="mt-7 max-w-md text-base leading-7 text-slate-200 md:text-lg">
              Build a lifelong reading habit with books, audiobooks, videos,
              challenges and intelligent progress tracking.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-7 py-4 text-sm font-black text-[#000D24] shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-300"
              >
                Start Reading
              </Link>

              <Link
                href="/library"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Play size={13} fill="currentColor" />
                </span>
                Browse Library
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["FM", "A", "J", "E"].map((item) => (
                  <div
                    key={item}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#000D24] bg-gradient-to-br from-emerald-300 to-amber-300 text-xs font-black text-slate-900"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="max-w-xs text-sm font-medium leading-6 text-slate-200">
                Join 8,000+ readers growing every day on Readora.
              </p>
            </div>
          </div>

          {/* DESKTOP RIGHT IMAGE ONLY */}
          <div className="relative hidden h-[420px] items-center justify-center lg:!flex">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#000D24]/10 to-[#000D24]" />
            <div className="absolute right-20 top-12 h-72 w-72 rounded-full bg-amber-400/20 blur-[120px]" />
            <div className="absolute bottom-8 right-32 h-64 w-64 rounded-full bg-emerald-400/15 blur-[120px]" />

            <Image
              src="/readorahero4.png"
              alt="Readora Hero"
              width={760}
              height={560}
              priority
              className="relative z-10 w-full max-w-[650px] -translate-y-4 object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)] [mask-image:radial-gradient(circle_at_center,black_68%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_68%,transparent_100%)]"
            />
          </div>
        </div>



        <div className="relative z-20 mx-auto max-w-7xl px-5 pb-8 md:px-8">
          <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-2xl backdrop-blur md:grid-cols-4">
            {[
              { value: "500+", label: "Books", icon: BookOpen },
              { value: "120+", label: "Audiobooks", icon: Headphones },
              { value: "35,000+", label: "Pages Read", icon: Users },
              { value: "8,000+", label: "Readers", icon: Trophy },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`
            flex items-center gap-3 px-4 py-5 sm:gap-4 sm:px-6 md:px-7 md:py-6
            ${index === 0 || index === 2 ? "border-r border-white/10" : ""}
            ${index < 2 ? "border-b border-white/10 md:border-b-0" : ""}
            ${index !== 3 ? "md:border-r md:border-white/10" : ""}
          `}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-300 sm:h-12 sm:w-12">
                    <Icon size={24} />
                  </div>

                  <div>
                    <p className="text-2xl font-black sm:text-3xl">{stat.value}</p>
                    <p className="text-xs text-slate-300 sm:text-sm">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-2xl font-black">Popular Categories</h2>
          <Link href="/library" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (


              <Link
                key={category.name}
                href={`/library?category=${encodeURIComponent(category.name)}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon size={22} />
                </div>
                <p className="text-xs font-black text-slate-700">{category.name}</p>
              </Link>
            );
          })}
        </div>
      </section>



      {/* FEATURED BOOKS */}
      <section id="library" className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-2xl font-black">Featured Books</h2>

          <Link
            href="/library"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white"
          >
            View all
          </Link>
        </div>

        {featuredBooks.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <BookOpen className="mx-auto text-slate-400" size={48} />
            <h3 className="mt-4 text-xl font-black text-[#000D24]">
              No featured books yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Published books will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {featuredBooks.map((book: FeaturedBookItem) => {
              const averageRating =
                book.reviews.length > 0
                  ? book.reviews.reduce((sum: number, review: ReviewItem) => sum + review.rating, 0) /
                  book.reviews.length
                  : 0;

              return (
                <Link
                  key={book.id}
                  href={`/library/${book.slug}`}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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

                  <div className="p-2 pt-4">
                    <h3 className="text-sm font-black text-[#000D24]">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {book.author?.name || "Unknown Author"}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-500">
                        ★ {averageRating > 0 ? averageRating.toFixed(1) : "No rating"}
                      </span>

                      <span className="font-bold text-slate-500">
                        {book.reviews.length} review(s)
                      </span>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-[70%] rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>


      {/* <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-2xl font-black">
            Recommended For You
          </h2>

          <Link
            href="/library"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white"
          >
            Explore
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {recommendedBooks.map((book) => (
            <Link
              key={book.id}
              href={`/library/${book.slug}`}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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

              <div className="p-2 pt-4">
                <h3 className="text-sm font-black text-[#000D24]">
                  {book.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {book.author?.name || "Unknown Author"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section> */}


      {/* RECOMMENDED BOOKS */}
<section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
  <div className="mb-7 flex items-center justify-between">
    <h2 className="text-2xl font-black">Recommended For You</h2>

    <Link
      href="/library"
      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white"
    >
      Explore
    </Link>
  </div>

  {recommendedBooks.length === 0 ? (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <BookOpen className="mx-auto text-slate-400" size={48} />
      <h3 className="mt-4 text-xl font-black text-[#000D24]">
        No recommendations yet
      </h3>
    </div>
  ) : (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {recommendedBooks.map((book) => (
        <Link
          key={book.id}
          href={`/library/${book.slug}`}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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

          <div className="p-2 pt-4">
            <h3 className="text-sm font-black text-[#000D24]">
              {book.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {book.author?.name || "Unknown Author"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )}
</section>

      {/* CHALLENGE */}
      <section id="challenge" className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#000D24] p-7 text-white shadow-2xl md:p-9">
          <div className="grid items-center gap-8 lg:grid-cols-[0.25fr_0.55fr_0.35fr_0.3fr]">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-400/10 text-6xl">
              🏆
            </div>

            <div>
              <h2 className="text-3xl font-black">June Reading Challenge</h2>
              <p className="mt-2 max-w-lg text-slate-300">
                Read 3 books this month and earn the Gold Reader Badge.
              </p>
              <Link href="/challenges" className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-[#000D24]">
                Join Challenge →
              </Link>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>2 / 3 Books</span>
                <span>67%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10">
                <div className="h-3 w-[67%] rounded-full bg-amber-400" />
              </div>
            </div>

            <div className="text-center text-7xl">⭐</div>
          </div>
        </div>
      </section>


      {/* BOOK OF THE MONTH + TOP READERS */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 md:px-8 lg:grid-cols-2">


        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-[#000D24]">Book of the Month</p>

          {bookOfTheMonth ? (
            <div className="mt-5 flex gap-5">
              {bookOfTheMonth.coverImage ? (
                <img
                  src={bookOfTheMonth.coverImage}
                  alt={bookOfTheMonth.title}
                  className="h-44 w-32 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-44 w-32 shrink-0 items-center justify-center rounded-2xl bg-[#000D24] p-4 text-center text-white">
                  <p className="text-xl font-black leading-tight">
                    {bookOfTheMonth.title}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-black text-[#000D24]">
                  {bookOfTheMonth.title}
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {bookOfTheMonth.author?.name || "Unknown Author"}
                </p>



                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Categories
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {bookOfTheMonth.categories.length > 0 ? (
                      bookOfTheMonth.categories.map((item: BookCategoryItem) => (
                        <span
                          key={item.category.id}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                        >
                          {item.category.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                        General
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/library/${bookOfTheMonth.slug}`}
                  className="mt-5 inline-flex rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
                >
                  Read Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-sm font-semibold text-slate-500">
              No published book available yet.
            </div>
          )}
        </div>

        {/* <div id="leaderboard" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-[#000D24]">Top Readers</p>

          <div className="mt-5 space-y-4">


            {topReaders.length > 0 ? (
              topReaders.map((reader, index) => (
                <div key={reader.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-500">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                      {reader.name?.charAt(0).toUpperCase() || "R"}
                    </div>

                    <div>
                      <p className="font-black text-[#000D24]">
                        {reader.name || "Reader"}
                      </p>



                      <p className="text-xs text-slate-500">
                        {reader.readingProgress.filter((item) => item.completed).length} books •{" "}
                        {reader.streak} day streak •{" "}
                        {reader.readingSessions.reduce(
                          (sum, session) => sum + session.pagesRead,
                          0
                        )}{" "}
                        pages
                      </p>

                      {reader.badges.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {reader.badges.slice(0, 2).map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700"
                            >
                              {item.badge.name}
                            </span>
                          ))}
                        </div>
                      )}


                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-500">
                    {reader.readingXp.toLocaleString()} XP
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                No top readers yet.
              </div>
            )}
          </div>

          <Link
            href="/leaderboard"
            className="mt-6 inline-flex rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-[#000D24]"
          >
            View Leaderboard
          </Link>
        </div> */}


        <div id="leaderboard" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-black text-[#000D24]">Top Readers</p>

            <Link
              href="/leaderboard"
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-[#000D24]"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                All-Time
              </p>

              <div className="space-y-4">
                {topReaders.length > 0 ? (
                  topReaders.map((reader: TopReaderItem, index: number) => (
                    <div key={reader.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-500">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>

                        <div>
                          <p className="font-black text-[#000D24]">
                            {reader.name || "Reader"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {reader.readingProgress.filter((item: ReadingProgressItem) => item.completed).length} books
                          </p>
                        </div>
                      </div>

                      <p className="text-xs font-black text-emerald-600">
                        {reader.readingXp.toLocaleString()} XP
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-slate-500">
                    No top readers yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                This Week
              </p>

              <div className="space-y-4">
                {weeklyTopReaders.length > 0 ? (
                  weeklyTopReaders.map((reader: WeeklyReaderWithPages, index: number) => (
                    <div key={reader.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-500">
                          {index === 0 ? "🔥" : index === 1 ? "⚡" : "✨"}
                        </span>

                        <div>
                          <p className="font-black text-[#000D24]">
                            {reader.name || "Reader"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {reader.weeklyPages} pages this week
                          </p>
                        </div>
                      </div>

                      <p className="text-xs font-black text-orange-600">
                        {reader.weeklyPages} pages
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-slate-500">
                    No weekly activity yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold text-emerald-600">Loved by Readers</p>
          <h2 className="text-3xl font-black text-[#000D24]">
            Readers are growing with Readora
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              "John D.",
              "Readora has completely changed the way I read and learn. I actually finish books now.",
            ],
            [
              "Esther M.",
              "The challenges and streaks keep me motivated every day.",
            ],
            [
              "Michael O.",
              "I love the clean interface and how easy it is to track my progress.",
            ],
          ].map(([name, text]) => (
            <div
              key={name}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#000D24] text-lg font-black text-white">
                  {name[0]}
                </div>

                <div>
                  <p className="font-black text-[#000D24]">{name}</p>
                  <div className="mt-1 flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">“{text}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}