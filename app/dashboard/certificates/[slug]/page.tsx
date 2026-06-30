

import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { ArrowLeft, Award, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CertificatePrintButton from "@/components/certificates/CertificatePrintButton";

export const dynamic = "force-dynamic";

export default async function CertificateViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
        <Link
          href="/login"
          className="rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const progress = await prisma.readingProgress.findFirst({
    where: {
      userId: session.user.id,
      completed: true,
      book: {
        slug,
      },
    },
    include: {
      book: {
        include: {
          author: true,
        },
      },
      user: true,
    },
  });

  if (!progress) notFound();

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/certificates"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Certificates
        </Link>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="rounded-[2rem] border-[10px] border-[#000D24] bg-white p-8 text-center md:p-14">
            <div className="mx-auto mb-6 flex justify-center">
              <Image
                src="/readoralogo.png"
                alt="Readora"
                width={70}
                height={70}
                className="rounded-2xl"
              />
            </div>

            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-600">
              Readora
            </p>

            <h1 className="mt-5 text-4xl font-black text-[#000D24] md:text-6xl">
              Certificate of Completion
            </h1>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              This certifies that
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#000D24] md:text-5xl">
              {progress.user.name || "Reader"}
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              has successfully completed the book{" "}
              <span className="font-black text-[#000D24]">
                {progress.book.title}
              </span>{" "}
              by {progress.book.author?.name || "Unknown Author"} on Readora.
            </p>

            <div className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Award size={44} />
            </div>

            <div className="mt-10 grid gap-4 text-sm font-bold text-slate-500 md:grid-cols-2">
              <p>
                Completed:{" "}
                {progress.completedAt
                  ? progress.completedAt.toLocaleDateString()
                  : "Recently"}
              </p>

              <p>Certificate ID: {progress.id.slice(0, 10).toUpperCase()}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <CertificatePrintButton />
          </div>
        </section>
      </div>
    </main>
  );
}