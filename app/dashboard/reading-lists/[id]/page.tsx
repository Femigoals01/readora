

// import DashboardShell from "@/components/layout/DashboardShell";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { ArrowLeft, BookOpen } from "lucide-react";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import RemoveFromReadingListButton from "@/components/reading-lists/RemoveFromReadingListButton";
// import ReadingListPublicToggle from "@/components/reading-lists/ReadingListPublicToggle";
// import CopyReadingListLinkButton from "@/components/reading-lists/CopyReadingListLinkButton";
// import DeleteReadingListButton from "@/components/reading-lists/DeleteReadingListButton";

// export const dynamic = "force-dynamic";

// export default async function ReadingListDetailsPage({
//     params,
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const { id } = await params;
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//         return (
//             <DashboardShell>
//                 <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
//                     <h1 className="text-2xl font-black text-[#000D24]">Please sign in</h1>
//                     <Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white">
//                         Sign In
//                     </Link>
//                 </div>
//             </DashboardShell>
//         );
//     }

//     const list = await prisma.readingList.findFirst({
//         where: {
//             id,
//             userId: session.user.id,
//         },
//         include: {
//             books: {
//                 orderBy: { createdAt: "desc" },
//                 include: {
//                     book: {
//                         include: {
//                             author: true,
//                             files: true,
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     if (!list) notFound();

//     return (
//         <DashboardShell>
//             <div className="w-full">
//                 <Link
//                     href="/dashboard/reading-lists"
//                     className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//                 >
//                     <ArrowLeft size={18} />
//                     Back to Reading Lists
//                 </Link>

//                 {/* <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//                     <p className="font-bold text-emerald-300">Reading List</p>
//                     <h1 className="mt-3 text-4xl font-black">{list.name}</h1>
//                     <p className="mt-3 max-w-2xl text-slate-300">
//                         {list.description || "No description yet."}
//                     </p>
//                 </section> */}


//                 <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//                     <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
//                         <div>
//                             <p className="font-bold text-emerald-300">Reading List</p>
//                             <h1 className="mt-3 text-4xl font-black">{list.name}</h1>
//                             <p className="mt-3 max-w-2xl text-slate-300">
//                                 {list.description || "No description yet."}
//                             </p>

//                             {list.public && (
//                                 <p className="mt-4 text-sm font-bold text-emerald-300">
//                                     Share link: /readlists/{list.id}
//                                 </p>
//                             )}
//                         </div>

//                         {/* <ReadingListPublicToggle
//       listId={list.id}
//       initialPublic={list.public}
//     />

//     {list.public && <CopyReadingListLinkButton listId={list.id} />} */}


//                         <div className="flex flex-wrap gap-3">
//   <ReadingListPublicToggle
//     listId={list.id}
//     initialPublic={list.public}
//   />

//   {list.public ? (
//     <CopyReadingListLinkButton listId={list.id} />
//   ) : (
//     <p className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-slate-300">
//       Make this list public to share it.
//     </p>
//   )}

//   <DeleteReadingListButton listId={list.id} />
// </div>
//                     </div>
//                 </section>

//                 <section className="mt-8">
//                     {list.books.length === 0 ? (
//                         <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
//                             <BookOpen className="mx-auto text-slate-400" size={52} />
//                             <h2 className="mt-4 text-2xl font-black text-[#000D24]">
//                                 No books in this list yet
//                             </h2>
//                             <p className="mt-2 text-sm text-slate-500">
//                                 Open a book and add it to this reading list.
//                             </p>
//                             <Link
//                                 href="/library"
//                                 className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
//                             >
//                                 Browse Library
//                             </Link>
//                         </div>
//                     ) : (
//                         <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//                             {list.books.map((item) => {
//                                 const book = item.book;
//                                 const mainFile = book.files[0];

//                                 return (
//                                     <div
//                                         key={item.id}
//                                         className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//                                     >
//                                         {book.coverImage ? (
//                                             <img
//                                                 src={book.coverImage}
//                                                 alt={book.title}
//                                                 className="aspect-[3/4] w-full rounded-2xl object-cover"
//                                             />
//                                         ) : (
//                                             <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-[#000D24] p-5 text-center text-white">
//                                                 <h3 className="text-2xl font-black leading-tight">
//                                                     {book.title}
//                                                 </h3>
//                                             </div>
//                                         )}

//                                         <div className="pt-4">
//                                             <h3 className="font-black text-[#000D24]">{book.title}</h3>
//                                             <p className="mt-1 text-sm text-slate-500">
//                                                 {book.author?.name || "Unknown Author"}
//                                             </p>

//                                             <div className="mt-5 grid grid-cols-2 gap-2">
//                                                 <Link
//                                                     href={`/library/${book.slug}`}
//                                                     className="rounded-xl bg-[#000D24] px-3 py-3 text-center text-xs font-black text-white"
//                                                 >
//                                                     View
//                                                 </Link>

//                                                 {mainFile ? (
//                                                     <Link
//                                                         href={`/reader/${book.slug}`}
//                                                         className="rounded-xl bg-emerald-400 px-3 py-3 text-center text-xs font-black text-[#000D24]"
//                                                     >
//                                                         Read
//                                                     </Link>
//                                                 ) : (
//                                                     <button className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-400">
//                                                         No File
//                                                     </button>
//                                                 )}

//                                                 <RemoveFromReadingListButton
//                                                     listId={list.id}
//                                                     bookId={book.id}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </section>
//             </div>
//         </DashboardShell>
//     );
// }



import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, BookOpen } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RemoveFromReadingListButton from "@/components/reading-lists/RemoveFromReadingListButton";
import ReadingListPublicToggle from "@/components/reading-lists/ReadingListPublicToggle";
import CopyReadingListLinkButton from "@/components/reading-lists/CopyReadingListLinkButton";
import DeleteReadingListButton from "@/components/reading-lists/DeleteReadingListButton";

export const dynamic = "force-dynamic";



type ReadingListBookItem = {
  id: string;
  book: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    author: {
      name: string;
    } | null;
    files: {
      id: string;
    }[];
  };
};

export default async function ReadingListDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
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
      </DashboardShell>
    );
  }

  const list = await prisma.readingList.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      books: {
        orderBy: { createdAt: "desc" },
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
    <DashboardShell>
      <div className="w-full">
        <Link
          href="/dashboard/reading-lists"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Reading Lists
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="font-bold text-emerald-300">Reading List</p>

              <h1 className="mt-3 text-4xl font-black">{list.name}</h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                {list.description || "No description yet."}
              </p>

              {list.public && (
                <p className="mt-4 text-sm font-bold text-emerald-300">
                  Share link: /readlists/{list.id}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <ReadingListPublicToggle
                listId={list.id}
                initialPublic={list.public}
              />

              {list.public ? (
                <CopyReadingListLinkButton listId={list.id} />
              ) : (
                <p className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-slate-300">
                  Make this list public to share it.
                </p>
              )}

              <DeleteReadingListButton listId={list.id} />
            </div>
          </div>
        </section>

        <section className="mt-8">
          {list.books.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto text-slate-400" size={52} />

              <h2 className="mt-4 text-2xl font-black text-[#000D24]">
                No books in this list yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Open a book and add it to this reading list.
              </p>

              <Link
                href="/library"
                className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
              >
                Browse Library
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {list.books.map((item: ReadingListBookItem) => {
                const book = item.book;
                const mainFile = book.files[0];

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

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link
                          href={`/library/${book.slug}`}
                          className="rounded-xl bg-[#000D24] px-3 py-3 text-center text-xs font-black text-white"
                        >
                          View
                        </Link>

                        {mainFile ? (
                          <Link
                            href={`/reader/${book.slug}`}
                            className="rounded-xl bg-emerald-400 px-3 py-3 text-center text-xs font-black text-[#000D24]"
                          >
                            Read
                          </Link>
                        ) : (
                          <button className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-400">
                            No File
                          </button>
                        )}

                        <RemoveFromReadingListButton
                          listId={list.id}
                          bookId={book.id}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}