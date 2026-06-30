


// import Link from "next/link";
// import { ArrowLeft, Users, UserPlus } from "lucide-react";
// import DashboardShell from "@/components/layout/DashboardShell";

// export default function FamilyReadingPage() {
//   const family = [
//     { name: "Dad", progress: 92 },
//     { name: "Mum", progress: 87 },
//     { name: "Sarah", progress: 65 },
//     { name: "Daniel", progress: 80 },
//   ];

//   return (
//     // <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
//         <DashboardShell>
//       <div className="mx-auto max-w-5xl">
//         <Link
//           href="/dashboard"
//           className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//         >
//           <ArrowLeft size={18} />
//           Back to Dashboard
//         </Link>

//         <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//           <p className="font-bold text-emerald-300">Family Discipleship</p>
//           <h1 className="mt-3 text-5xl font-black">Family Reading</h1>
//           <p className="mt-3 max-w-2xl text-slate-300">
//             Invite family members, follow their reading journey, and grow together.
//           </p>
//         </section>

//         <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
//           <div className="mb-6 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Users className="text-emerald-600" size={32} />
//               <h2 className="text-2xl font-black text-[#000D24]">
//                 Family Progress
//               </h2>
//             </div>

//             <button className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white">
//               <UserPlus size={18} />
//               Invite Member
//             </button>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             {family.map((member) => (
//               <div
//                 key={member.name}
//                 className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
//               >
//                 <div className="flex justify-between">
//                   <p className="font-black text-[#000D24]">{member.name}</p>
//                   <p className="font-black text-emerald-600">
//                     {member.progress}%
//                   </p>
//                 </div>

//                 <div className="mt-4 h-3 rounded-full bg-white">
//                   <div
//                     className="h-3 rounded-full bg-emerald-400"
//                     style={{ width: `${member.progress}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </DashboardShell>
//   );
// }




import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FamilyReadingPage() {
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

  const families = await prisma.family.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
      members: {
        include: {
          user: true,
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
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="font-bold text-emerald-300">
                Family Discipleship
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">
                Family Reading
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Invite family members, follow their reading journey, and grow
                together.
              </p>
            </div>

            <Link
              href="/dashboard/family/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-[#000D24]"
            >
              <Plus size={18} />
              Create Family
            </Link>
          </div>
        </section>

        {families.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Users className="mx-auto text-slate-400" size={52} />

            <h2 className="mt-4 text-2xl font-black text-[#000D24]">
              No family group yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first family group to encourage reading at home.
            </p>

            <Link
              href="/dashboard/family/new"
              className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
            >
              Create Family
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {families.map((family) => (
              <Link
                key={family.id}
                href={`/dashboard/family/${family.id}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Users size={26} />
                </div>

                <h2 className="mt-5 text-2xl font-black text-[#000D24]">
                  {family.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {family.description || "No description yet."}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-black text-emerald-600">
                    {family.members.length} member(s)
                  </p>

                  <p className="text-xs font-bold text-slate-400">
                    Owner: {family.owner.name || "Reader"}
                  </p>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </DashboardShell>
  );
}