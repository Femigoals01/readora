"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Filter, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";


type LibraryBook = {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    author: { name: string } | null;
    files: {
        id: string;
        fileType: string;
        fileUrl: string;
    }[];
    categories: {
        category: {
            id: string;
            name: string;
        };
    }[];
    reviews: {
        rating: number;
    }[];
};

type Category = {
    id: string;
    name: string;
};

export default function LibraryClient({
    books,
    categories,
}: {
    books: LibraryBook[];
    categories: Category[];
}) {
    const [search, setSearch] = useState("");
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("newest");

    const searchParams = useSearchParams();
const categoryFromUrl = searchParams.get("category");

const [selectedCategories, setSelectedCategories] = useState<string[]>(
  categoryFromUrl ? [categoryFromUrl] : []
);

    function toggleCategory(categoryName: string) {
        setSelectedCategories((current) =>
            current.includes(categoryName)
                ? current.filter((item) => item !== categoryName)
                : [...current, categoryName]
        );
    }



    // const filteredBooks = useMemo(() => {
    //     return books.filter((book) => {
    //         const text = [
    //             book.title,
    //             book.author?.name || "",
    //             ...book.categories.map((item) => item.category.name),
    //         ]
    //             .join(" ")
    //             .toLowerCase();

    //         const matchesSearch = text.includes(search.toLowerCase());

    //         const matchesCategory =
    //             selectedCategories.length === 0 ||
    //             book.categories.some((item) =>
    //                 selectedCategories.includes(item.category.name)
    //             );

    //         return matchesSearch && matchesCategory;
    //     });
    // }, [books, search, selectedCategories]);


    const filteredBooks = useMemo(() => {
  const result = books.filter((book) => {
    const text = [
      book.title,
      book.author?.name || "",
      ...book.categories.map((item) => item.category.name),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      book.categories.some((item) =>
        selectedCategories.includes(item.category.name)
      );

    return matchesSearch && matchesCategory;
  });

  return result.sort((a, b) => {
    const ratingA =
      a.reviews.length > 0
        ? a.reviews.reduce((sum, review) => sum + review.rating, 0) /
          a.reviews.length
        : 0;

    const ratingB =
      b.reviews.length > 0
        ? b.reviews.reduce((sum, review) => sum + review.rating, 0) /
          b.reviews.length
        : 0;

    if (sortBy === "highest-rated") return ratingB - ratingA;
    if (sortBy === "most-reviewed") return b.reviews.length - a.reviews.length;
    if (sortBy === "title-az") return a.title.localeCompare(b.title);

    return 0;
  });
}, [books, search, selectedCategories, sortBy]);



    const hasFilters = search.trim().length > 0 || selectedCategories.length > 0;

    function clearFilters() {
        setSearch("");
        setSelectedCategories([]);
    }

    return (
        <>
            <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl md:p-12">
                <p className="font-bold text-emerald-300">Digital Library</p>

                <h1 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">
                    Discover books, audiobooks, videos and study resources.
                </h1>

                <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-3 text-slate-900">
                    <Search className="text-slate-400" size={22} />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search books, authors, categories..."
                        className="w-full bg-transparent text-sm outline-none"
                    />
                </div>
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
                <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <Filter size={18} />
                        <h2 className="font-black">Categories</h2>
                    </div>

                    <div>
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                className="mb-3 flex items-center gap-2 text-sm text-slate-600"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => toggleCategory(category.name)}
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                </aside>

                <div>
                    {/* <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-black">All Resources</h2>
                        <p className="text-sm font-semibold text-slate-500">
                            Showing {filteredBooks.length} resources
                        </p>
                    </div> */}


                  
                        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                            <div>
                                <h2 className="text-2xl font-black">All Resources</h2>
                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                    Showing {filteredBooks.length} of {books.length} resources
                                </p>
                            </div>

                            <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 outline-none"
>
  <option value="newest">Newest</option>
  <option value="highest-rated">Highest Rated</option>
  <option value="most-reviewed">Most Reviewed</option>
  <option value="title-az">Title A–Z</option>
</select>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="rounded-xl bg-[#000D24] px-4 py-3 text-xs font-black text-white"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {selectedCategories.length > 0 && (
                            <div className="mb-5 flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => toggleCategory(category)}
                                        className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700"
                                    >
                                        {category} ×
                                    </button>
                                ))}
                            </div>
                        )}

                        {filteredBooks.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <BookOpen className="mx-auto text-slate-400" size={48} />

                                <h3 className="mt-4 text-xl font-black text-[#000D24]">
                                    No resources found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Try another search term or category.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredBooks.map((book) => {
                                    const mainFile = book.files[0];

                                    const averageRating =
                                        book.reviews.length > 0
                                            ? book.reviews.reduce(
                                                (sum, review) => sum + review.rating,
                                                0
                                            ) / book.reviews.length
                                            : 0;

                                    return (
                                        <div
                                            key={book.id}
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
                                                <h3 className="font-black">{book.title}</h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {book.author?.name || "Unknown Author"}
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {book.categories.map((item) => (
                                                        <span
                                                            key={item.category.id}
                                                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
                                                        >
                                                            {item.category.name}
                                                        </span>
                                                    ))}

                                                    {mainFile && (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                                                            {mainFile.fileType}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex items-center justify-between text-xs">
                                                    <span className="font-bold text-amber-500">
                                                        ★{" "}
                                                        {averageRating > 0
                                                            ? averageRating.toFixed(1)
                                                            : "No rating"}
                                                    </span>

                                                    <span className="font-bold text-slate-500">
                                                        {book.reviews.length} review(s)
                                                    </span>
                                                </div>

                                                <div className="mt-5 grid grid-cols-3 gap-2">
                                                    <Link
                                                        href={`/library/${book.slug}`}
                                                        className="rounded-xl bg-[#000D24] px-3 py-3 text-center text-xs font-black text-white"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        href={`/reader/${book.slug}`}
                                                        className="rounded-xl bg-slate-100 px-3 py-3 text-center text-xs font-black text-slate-700"
                                                    >
                                                        Read
                                                    </Link>

                                                    {mainFile ? (
                                                        <a
                                                            href={mainFile.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-xl bg-emerald-400 px-3 py-3 text-center text-xs font-black text-[#000D24]"
                                                        >
                                                            Download
                                                        </a>
                                                    ) : (
                                                        <button className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-400">
                                                            No File
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
            </section>
        </>
    );
}