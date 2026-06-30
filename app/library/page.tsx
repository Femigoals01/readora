



// import PublicShell from "@/components/layout/PublicShell";
// import Link from "next/link";
// import { Search, Filter, BookOpen } from "lucide-react";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// export default async function LibraryPage() {
//     const books = await prisma.book.findMany({
//         where: {
//             status: "PUBLISHED",
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//         include: {
//             author: true,
//             files: true,
//             categories: {
//                 include: {
//                     category: true,

//                 },
//             },
//             reviews: true,
//         },
//     });

//     const categories = await prisma.category.findMany({
//         orderBy: {
//             name: "asc",
//         },
//     });

//     return (
//         <PublicShell>
//             <div className="px-5 py-8 md:px-8">
//                 <div className="mx-auto max-w-7xl">


//                     <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl md:p-12">
//                         <p className="font-bold text-emerald-300">Digital Library</p>
//                         <h1 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">
//                             Discover books, audiobooks, videos and study resources.
//                         </h1>

//                         <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-3 text-slate-900">
//                             <Search className="text-slate-400" size={22} />
//                             <input
//                                 placeholder="Search books, authors, categories..."
//                                 className="w-full bg-transparent text-sm outline-none"
//                             />
//                             <button className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-[#000D24]">
//                                 Search
//                             </button>
//                         </div>
//                     </section>

//                     <section className="mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
//                         <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//                             <div className="mb-6 flex items-center gap-2">
//                                 <Filter size={18} />
//                                 <h2 className="font-black">Categories</h2>
//                             </div>

//                             <div>
//                                 {categories.map((category) => (
//                                     <label
//                                         key={category.id}
//                                         className="mb-3 flex items-center gap-2 text-sm text-slate-600"
//                                     >
//                                         <input type="checkbox" />
//                                         {category.name}
//                                     </label>
//                                 ))}
//                             </div>
//                         </aside>

//                         <div>
//                             <div className="mb-5 flex items-center justify-between">
//                                 <h2 className="text-2xl font-black">All Resources</h2>
//                                 <p className="text-sm font-semibold text-slate-500">
//                                     Showing {books.length} resources
//                                 </p>
//                             </div>

//                             {books.length === 0 ? (
//                                 <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
//                                     <BookOpen className="mx-auto text-slate-400" size={48} />
//                                     <h3 className="mt-4 text-xl font-black text-[#000D24]">
//                                         No published resources yet
//                                     </h3>
//                                     <p className="mt-2 text-sm text-slate-500">
//                                         Upload and publish a resource from the admin dashboard.
//                                     </p>
//                                 </div>
//                             ) : (
//                                 <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//                                     {books.map((book) => {
//                                         const mainFile = book.files[0];
//                                         const averageRating =
//                                             book.reviews.length > 0
//                                                 ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
//                                                 book.reviews.length
//                                                 : 0;

//                                         return (
//                                             <div
//                                                 key={book.id}
//                                                 className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//                                             >
//                                                 {book.coverImage ? (
//                                                     <img
//                                                         src={book.coverImage}
//                                                         alt={book.title}
//                                                         className="aspect-[3/4] w-full rounded-2xl object-cover"
//                                                     />
//                                                 ) : (
//                                                     <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-[#000D24] p-5 text-center text-white">
//                                                         <h3 className="text-2xl font-black leading-tight">
//                                                             {book.title}
//                                                         </h3>
//                                                     </div>
//                                                 )}

//                                                 <div className="pt-4">
//                                                     <h3 className="font-black">{book.title}</h3>
//                                                     <p className="mt-1 text-sm text-slate-500">
//                                                         {book.author?.name || "Unknown Author"}
//                                                     </p>

                                                    

//                                                     {/* <div className="mt-3 flex flex-wrap gap-2">
//                                                         {book.categories.map((item) => (
//                                                             <span
//                                                                 key={item.category.id}
//                                                                 className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
//                                                             >
//                                                                 {item.category.name}
//                                                             </span>
//                                                         ))}

//                                                         {mainFile && (
//                                                             <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
//                                                                 {mainFile.fileType}
//                                                             </span>
//                                                         )}
//                                                     </div> */}

//                                                     <div className="mt-3 flex flex-wrap gap-2">
//   {book.categories.map((item) => (
//     <span
//       key={item.category.id}
//       className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
//     >
//       {item.category.name}
//     </span>
//   ))}

//   {mainFile && (
//     <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
//       {mainFile.fileType}
//     </span>
//   )}
// </div>

// {/* ⭐ ADD THIS HERE */}
// <div className="mt-4 flex items-center justify-between text-xs">
//   <span className="font-bold text-amber-500">
//     ★ {averageRating > 0 ? averageRating.toFixed(1) : "No rating"}
//   </span>

//   <span className="font-bold text-slate-500">
//     {book.reviews.length} review(s)
//   </span>
// </div>

// <div className="mt-5 grid grid-cols-3 gap-2">
//   ...
// </div>

//                                                     <div className="mt-5 grid grid-cols-3 gap-2">
//                                                         <Link
//                                                             href={`/library/${book.slug}`}
//                                                             className="rounded-xl bg-[#000D24] px-3 py-3 text-center text-xs font-black text-white"
//                                                         >
//                                                             View
//                                                         </Link>

//                                                         <Link
//                                                             href={`/reader/${book.slug}`}
//                                                             className="rounded-xl bg-slate-100 px-3 py-3 text-center text-xs font-black text-slate-700"
//                                                         >
//                                                             Read
//                                                         </Link>

//                                                         {mainFile ? (
//                                                             <a
//                                                                 href={mainFile.fileUrl}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="rounded-xl bg-emerald-400 px-3 py-3 text-center text-xs font-black text-[#000D24]"
//                                                             >
//                                                                 Download
//                                                             </a>
//                                                         ) : (
//                                                             <button className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-400">
//                                                                 No File
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             )}
//                         </div>
//                     </section>
//                 </div>
//             </div>
//         </PublicShell>
//     );
// }




import PublicShell from "@/components/layout/PublicShell";
import LibraryClient from "@/components/library/LibraryClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const books = await prisma.book.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      files: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <PublicShell>
      <div className="px-5 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <LibraryClient books={books} categories={categories} />
        </div>
      </div>
    </PublicShell>
  );
}