

// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { ArrowLeft, MessageSquareText } from "lucide-react";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import DashboardShell from "@/components/layout/DashboardShell";

// export const dynamic = "force-dynamic";

// export default async function ReflectionsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return (
//     //   <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">

//         <DashboardShell>
//         <Link
//           href="/login"
//           className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
//         >
//           Sign In
//         </Link>

//         </DashboardShell>
      
//     );
//   }

//   const reflections = await prisma.reflection.findMany({
//     where: {
//       userId: session.user.id,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       book: {
//         include: {
//           author: true,
//         },
//       },
//     },
//   });

//   return (
//     <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
//       <div className="mx-auto max-w-5xl">
//         <Link
//           href="/dashboard"
//           className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//         >
//           <ArrowLeft size={18} />
//           Back to Dashboard
//         </Link>

//         <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//           <p className="font-bold text-emerald-300">My Learning Notes</p>
//           <h1 className="mt-3 text-5xl font-black">My Reflections</h1>
//           <p className="mt-3 max-w-2xl text-slate-300">
//             A personal record of what each book is teaching you.
//           </p>
//         </section>

//         <section className="mt-8 space-y-5">
//           {reflections.length === 0 ? (
//             <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
//               <MessageSquareText className="mx-auto text-slate-400" size={52} />
//               <h2 className="mt-4 text-2xl font-black text-[#000D24]">
//                 No reflections yet
//               </h2>
//               <p className="mt-2 text-sm text-slate-500">
//                 Open any book and write what you learned.
//               </p>
//             </div>
//           ) : (
//             reflections.map((reflection) => (
//               <article
//                 key={reflection.id}
//                 className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
//               >
//                 <p className="text-sm font-bold text-emerald-600">
//                   {reflection.book.title}
//                 </p>

//                 <h2 className="mt-1 text-xl font-black text-[#000D24]">
//                   by {reflection.book.author?.name || "Unknown Author"}
//                 </h2>

//                 <p className="mt-5 leading-8 text-slate-700">
//                   {reflection.content}
//                 </p>

//                 <p className="mt-5 text-xs font-bold text-slate-400">
//                   {reflection.createdAt.toLocaleDateString()}
//                 </p>
//               </article>
//             ))
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }



import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/layout/DashboardShell";

export const dynamic = "force-dynamic";

type ReflectionItem = {
  id: string;
  content: string;
  createdAt: Date;
  book: {
    title: string;
    author: {
      name: string;
    } | null;
  };
};

export default async function ReflectionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <DashboardShell>
        <Link
          href="/login"
          className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
        >
          Sign In
        </Link>
      </DashboardShell>
    );
  }

  const reflections = await prisma.reflection.findMany({
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
        },
      },
    },
  });

  return (
    <DashboardShell>
      <div className="w-full">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">My Learning Notes</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            My Reflections
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            A personal record of what each book is teaching you.
          </p>
        </section>

        <section className="mt-8 space-y-5">
          {reflections.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <MessageSquareText className="mx-auto text-slate-400" size={52} />
              <h2 className="mt-4 text-2xl font-black text-[#000D24]">
                No reflections yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Open any book and write what you learned.
              </p>
            </div>
          ) : (
            reflections.map((reflection: ReflectionItem) => (
              <article
                key={reflection.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold text-emerald-600">
                  {reflection.book.title}
                </p>

                <h2 className="mt-1 text-xl font-black text-[#000D24]">
                  by {reflection.book.author?.name || "Unknown Author"}
                </h2>

                <p className="mt-5 leading-8 text-slate-700">
                  {reflection.content}
                </p>

                <p className="mt-5 text-xs font-bold text-slate-400">
                  {reflection.createdAt.toLocaleDateString()}
                </p>
              </article>
            ))
          )}
        </section>
      </div>
    </DashboardShell>
  );
}