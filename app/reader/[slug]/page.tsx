


import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import PdfReaderClient from "./PdfReaderClient";

export const dynamic = "force-dynamic";

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      author: true,
      files: true,
      readingProgress: session?.user?.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
  });

  if (!book) notFound();

  const file = book.files[0];

  if (!file) notFound();

  const savedProgress = book.readingProgress?.[0];

  return (
    <PdfReaderClient
      book={{
        title: book.title,
        slug: book.slug,
        author: book.author?.name || "Unknown Author",
        fileUrl: `/api/books/${book.slug}/file`,
        fileType: file.fileType,
        startPage: savedProgress?.currentPage || 1,
      }}
    />
  );
}