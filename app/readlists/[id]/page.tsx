

// import PublicShell from "@/components/layout/PublicShell";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { BookOpen } from "lucide-react";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// export default async function PublicReadingListPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const list = await prisma.readingList.findFirst({
//     where: {
//       id,
//       public: true,
//     },
//     include: {
//       user: true,
//       books: {
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           book: {
//             include: {
//               author: true,
//               files: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!list) notFound();

//   return (
//     <PublicShell>
//       <div className="px-5 py-8 md:px-8">
//         <div className="mx-auto max-w-7xl">
//           <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//             <p className="font-bold text-emerald-300">Shared Reading List</p>

//             <h1 className="mt-3 text-4xl font-black">{list.name}</h1>

//             <p className="mt-3 max-w-2xl text-slate-300">
//               {list.description || "A public Readora reading list."}
//             </p>

//             <p className="mt-5 text-sm font-bold text-slate-400">
//               Curated by {list.user.name || "A Readora Reader"}
//             </p>
//           </section>

//           <section className="mt-8">
//             {list.books.length === 0 ? (
//               <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
//                 <BookOpen className="mx-auto text-slate-400" size={52} />
//                 <h2 className="mt-4 text-2xl font-black text-[#000D24]">
//                   No books in this list yet
//                 </h2>
//               </div>
//             ) : (
//               <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//                 {list.books.map((item) => {
//                   const book = item.book;

//                   return (
//                     <Link
//                       key={item.id}
//                       href={`/library/${book.slug}`}
//                       className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//                     >
//                       {book.coverImage ? (
//                         <img
//                           src={book.coverImage}
//                           alt={book.title}
//                           className="aspect-[3/4] w-full rounded-2xl object-cover"
//                         />
//                       ) : (
//                         <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-[#000D24] p-5 text-center text-white">
//                           <h3 className="text-2xl font-black leading-tight">
//                             {book.title}
//                           </h3>
//                         </div>
//                       )}

//                       <div className="pt-4">
//                         <h3 className="font-black text-[#000D24]">
//                           {book.title}
//                         </h3>

//                         <p className="mt-1 text-sm text-slate-500">
//                           {book.author?.name || "Unknown Author"}
//                         </p>

//                         <span className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-[#000D24]">
//                           View Book
//                         </span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}
//           </section>
//         </div>
//       </div>
//     </PublicShell>
//   );
// }




import PublicShell from "@/components/layout/PublicShell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PublicReadingListBookItem = {
  id: string;
  book: {
    title: string;
    slug: string;
    coverImage: string | null;
    author: {
      name: string;
    } | null;
  };
};

export default async function PublicReadingListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const list = await prisma.readingList.findFirst({
    where: {
      id,
      public: true,
    },
    include: {
      user: true,
      books: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          book: {
            include: {
              author: true,
              files: true,
            },
          },
        },
      },
    },
  });

  if (!list) notFound();

  return (
    <PublicShell>
      <div className="px-5 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
            <p className="font-bold text-emerald-300">Shared Reading List</p>

            <h1 className="mt-3 text-4xl font-black">{list.name}</h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              {list.description || "A public Readora reading list."}
            </p>

            <p className="mt-5 text-sm font-bold text-slate-400">
              Curated by {list.user.name || "A Readora Reader"}
            </p>
          </section>

          <section className="mt-8">
            {list.books.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <BookOpen className="mx-auto text-slate-400" size={52} />
                <h2 className="mt-4 text-2xl font-black text-[#000D24]">
                  No books in this list yet
                </h2>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {list.books.map((item: PublicReadingListBookItem) => {
                  const book = item.book;

                  return (
                    <Link
                      key={item.id}
                      href={`/library/${book.slug}`}
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

                        <span className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-[#000D24]">
                          View Book
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  );
}