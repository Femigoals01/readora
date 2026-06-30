

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug },
    include: { files: true },
  });

  const file = book?.files[0];

  if (!book || !file) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  const response = await fetch(file.fileUrl);

  if (!response.ok) {
    return NextResponse.json(
      { message: "Could not fetch file" },
      { status: 500 }
    );
  }

  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file.fileName || book.slug}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}