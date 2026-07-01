


// import Link from "next/link";
// import { ArrowLeft, MessageCircle } from "lucide-react";
// import { prisma } from "@/lib/prisma";
// import { notFound } from "next/navigation";
// import DiscussionClient from "./DiscussionClient";
// import PublicShell from "@/components/layout/PublicShell";

// export const dynamic = "force-dynamic";

// export default async function BookDiscussionPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;

//   const book = await prisma.book.findUnique({
//     where: { slug },
//     include: {
//       author: true,
//       discussions: {
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           user: true,
//         },
//       },
//     },
//   });

//   if (!book) notFound();

//   return (
//     // <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
//     //   <div className="mx-auto max-w-4xl">

//     <PublicShell>
//   <div className="px-5 py-8 md:px-8">
//         <Link
//           href={`/library/${book.slug}`}
//           className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//         >
//           <ArrowLeft size={18} />
//           Back to Book
//         </Link>

//         <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//           <p className="font-bold text-emerald-300">Book Discussion</p>
//           <h1 className="mt-3 text-4xl font-black">{book.title}</h1>
//           <p className="mt-2 text-slate-300">
//             by {book.author?.name || "Unknown Author"}
//           </p>
//         </section>

//         <div className="mt-8 flex items-center gap-3">
//           <MessageCircle className="text-emerald-600" />
//           <h2 className="text-2xl font-black text-[#000D24]">
//             Discussion Room
//           </h2>
//         </div>

//         <DiscussionClient
//           bookSlug={book.slug}
//           initialDiscussions={book.discussions.map((discussion) => ({
//             id: discussion.id,
//             message: discussion.message,
//             createdAt: discussion.createdAt.toISOString(),
//             user: {
//               name: discussion.user.name,
//               email: discussion.user.email,
//             },
//           }))}
//         />
//         </div>
// </PublicShell>
//   );
// }




import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DiscussionClient from "./DiscussionClient";
import PublicShell from "@/components/layout/PublicShell";

export const dynamic = "force-dynamic";

type DiscussionItem = {
  id: string;
  message: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
};

export default async function BookDiscussionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      author: true,
      discussions: {
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

  return (
    <PublicShell>
      <div className="px-5 py-8 md:px-8">
        <Link
          href={`/library/${book.slug}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Book
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">Book Discussion</p>
          <h1 className="mt-3 text-4xl font-black">{book.title}</h1>
          <p className="mt-2 text-slate-300">
            by {book.author?.name || "Unknown Author"}
          </p>
        </section>

        <div className="mt-8 flex items-center gap-3">
          <MessageCircle className="text-emerald-600" />
          <h2 className="text-2xl font-black text-[#000D24]">
            Discussion Room
          </h2>
        </div>

        <DiscussionClient
          bookSlug={book.slug}
          initialDiscussions={book.discussions.map(
            (discussion: DiscussionItem) => ({
              id: discussion.id,
              message: discussion.message,
              createdAt: discussion.createdAt.toISOString(),
              user: {
                name: discussion.user.name,
                email: discussion.user.email,
              },
            })
          )}
        />
      </div>
    </PublicShell>
  );
}