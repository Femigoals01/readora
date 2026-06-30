

import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
// import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { ArrowLeft, UserPlus, Users, Target, Trophy } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InviteFamilyMemberForm from "@/components/family/InviteFamilyMemberForm";
import RemoveFamilyMemberButton from "@/components/family/RemoveFamilyMemberButton";
import FamilyGoalForm from "@/components/family/FamilyGoalForm";
// import { Target } from "lucide-react";
import DeleteFamilyGoalButton from "@/components/family/DeleteFamilyGoalButton";
import DeleteFamilyButton from "@/components/family/DeleteFamilyButton";

export const dynamic = "force-dynamic";

export default async function FamilyDetailsPage({
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
                    <h1 className="text-2xl font-black text-[#000D24]">Please sign in</h1>
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

    const family = await prisma.family.findFirst({
        where: {
            id,
            members: {
                some: {
                    userId: session.user.id,
                },
            },
        },
        include: {
            owner: true,
            goals: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            members: {
                include: {
                    user: {
                        include: {
                            // readingProgress: {
                            //     where: {
                            //         completed: true,
                            //     },
                            //     select: {
                            //         id: true,
                            //     },
                            // },

                            readingProgress: {
                                where: {
                                    completed: true,
                                },
                                orderBy: {
                                    completedAt: "desc",
                                },
                                take: 5,
                                include: {
                                    book: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!family) notFound();

    const isOwner = family.ownerId === session.user.id;

    const familyCompletedBooks = family.members.reduce(
        (sum, member) => sum + member.user.readingProgress.length,
        0
    );

    const familyActivities = family.members
        .flatMap((member) =>
            member.user.readingProgress.map((progress) => ({
                id: progress.id,
                memberName: member.user.name || member.user.email.split("@")[0],
                bookTitle: progress.book.title,
                completedAt: progress.completedAt,
            }))
        )
        .sort(
            (a, b) =>
                new Date(b.completedAt || 0).getTime() -
                new Date(a.completedAt || 0).getTime()
        )
        .slice(0, 8);

    return (
        <DashboardShell>
            <div className="w-full">
                <Link
                    href="/dashboard/family"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
                >
                    <ArrowLeft size={18} />
                    Back to Family Reading
                </Link>

                {/* <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
                    <p className="font-bold text-emerald-300">Family Group</p>
                    <h1 className="mt-3 text-4xl font-black">{family.name}</h1>
                    <p className="mt-3 max-w-2xl text-slate-300">
                        {family.description || "No description yet."}
                    </p>
                </section> */}

                <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
    <div>
      <p className="font-bold text-emerald-300">Family Group</p>
      <h1 className="mt-3 text-4xl font-black">{family.name}</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        {family.description || "No description yet."}
      </p>
    </div>

    {isOwner && <DeleteFamilyButton familyId={family.id} />}
  </div>
</section>

                <section className="mt-8 grid gap-5 md:grid-cols-3">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Members</p>
                        <p className="mt-3 text-4xl font-black text-[#000D24]">
                            {family.members.length}
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Completed Books</p>
                        <p className="mt-3 text-4xl font-black text-[#000D24]">
                            {familyCompletedBooks}
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Active Goals</p>
                        <p className="mt-3 text-4xl font-black text-[#000D24]">
                            {family.goals.length}
                        </p>
                    </div>
                </section>

                {isOwner && <InviteFamilyMemberForm familyId={family.id} />}

                {isOwner && <FamilyGoalForm familyId={family.id} />}

                <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <Target className="text-emerald-600" size={32} />
                        <h2 className="text-2xl font-black text-[#000D24]">
                            Family Goals
                        </h2>
                    </div>

                    {family.goals.length === 0 ? (
                        <p className="text-sm font-semibold text-slate-500">
                            No family goals yet.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {family.goals.map((goal) => {
                                const percent = Math.min(
                                    100,
                                    Math.round((familyCompletedBooks / goal.targetBooks) * 100)
                                );

                                return (
                                    <div
                                        key={goal.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                                    >
                                        <h3 className="font-black text-[#000D24]">{goal.title}</h3>

                                        <p className="mt-2 text-sm font-bold text-slate-500">
                                            {familyCompletedBooks} / {goal.targetBooks} books completed
                                        </p>

                                        <div className="mt-4 h-3 rounded-full bg-white">
                                            <div
                                                className="h-3 rounded-full bg-emerald-400"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>

                                        <p className="mt-2 text-xs font-black text-emerald-600">
                                            {percent}% complete
                                        </p>

                                        {isOwner && <DeleteFamilyGoalButton goalId={goal.id} />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <Trophy className="text-amber-500" size={32} />
                        <h2 className="text-2xl font-black text-[#000D24]">
                            Family Leaderboard
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {[...family.members]
                            .sort(
                                (a, b) =>
                                    b.user.readingProgress.length -
                                    a.user.readingProgress.length
                            )
                            .map((member, index) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#000D24] text-sm font-black text-white">
                                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                        </div>

                                        <div>
                                            <p className="font-black text-[#000D24]">
                                                {member.user.name || member.user.email.split("@")[0]}
                                            </p>
                                            <p className="text-xs font-bold text-slate-500">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm font-black text-emerald-600">
                                        {member.user.readingProgress.length} completed
                                    </p>
                                </div>
                            ))}
                    </div>
                </section>


                <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <h2 className="text-2xl font-black text-[#000D24]">
                        Recent Family Activity
                    </h2>

                    {familyActivities.length === 0 ? (
                        <p className="mt-4 text-sm font-semibold text-slate-500">
                            No completed books yet.
                        </p>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {familyActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="rounded-2xl bg-slate-50 p-4"
                                >
                                    <p className="font-black text-[#000D24]">
                                        {activity.memberName} completed {activity.bookTitle}
                                    </p>

                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        {activity.completedAt
                                            ? new Date(activity.completedAt).toLocaleDateString()
                                            : "Recently"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <Users className="text-emerald-600" size={32} />
                        <h2 className="text-2xl font-black text-[#000D24]">
                            Family Members
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {family.members.map((member) => (
                            <div
                                key={member.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-black text-[#000D24]">
                                            {member.user.name || member.user.email.split("@")[0]}
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-slate-500">
                                            {member.role}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                        {member.user.readingProgress.length} completed
                                    </span>
                                </div>

                                <div className="mt-4 h-3 rounded-full bg-white">
                                    <div
                                        className="h-3 rounded-full bg-emerald-400"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                member.user.readingProgress.length * 10
                                            )}%`,
                                        }}
                                    />
                                </div>


                                {isOwner && member.userId !== session.user.id && (
                                    <RemoveFamilyMemberButton
                                        familyId={family.id}
                                        memberId={member.id}
                                    />
                                )}




                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </DashboardShell>
    );
}