


// import { NextResponse } from "next/server";
// import { FileType, BookStatus } from "@prisma/client";
// import { prisma } from "@/lib/prisma";
// import { cloudinary } from "@/lib/cloudinary";

// export const runtime = "nodejs";

// function slugify(value: string) {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)+/g, "");
// }

// async function uploadToCloudinary(file: File, folder: string, resourceType: "image" | "video" | "raw") {
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   return new Promise<any>((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//     //   {
//     //     folder,
//     //     resource_type: resourceType,
//     //   },

//     {
//   folder,
//   resource_type: resourceType,
//   use_filename: true,
//   unique_filename: true,
//   access_mode: "public",
// },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     stream.end(buffer);
//   });
// }

// function getFileType(file: File): FileType {
//   const name = file.name.toLowerCase();

//   if (name.endsWith(".pdf")) return FileType.PDF;
//   if (name.endsWith(".epub")) return FileType.EPUB;
//   if (name.endsWith(".docx")) return FileType.DOCX;
//   if (name.endsWith(".mp3")) return FileType.MP3;
//   if (name.endsWith(".mp4")) return FileType.MP4;

//   throw new Error("Unsupported file type.");
// }

// function getResourceType(fileType: FileType): "video" | "raw" {
//   if (fileType === FileType.MP4 || fileType === FileType.MP3) return "video";
//   return "raw";
// }

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const title = String(formData.get("title") || "");
//     const authorName = String(formData.get("author") || "");
//     const categorySlug = String(formData.get("category") || "");
//     const description = String(formData.get("description") || "");
//     const status = String(formData.get("status") || "DRAFT").toUpperCase();

//     const cover = formData.get("cover") as File | null;
//     const resource = formData.get("resource") as File | null;

//     if (!title || !authorName || !categorySlug || !resource) {
//       return NextResponse.json(
//         { message: "Title, author, category and resource file are required." },
//         { status: 400 }
//       );
//     }

//     const slug = slugify(title);

//     const existingBook = await prisma.book.findUnique({
//       where: { slug },
//     });

//     if (existingBook) {
//       return NextResponse.json(
//         { message: "A book with this title already exists." },
//         { status: 409 }
//       );
//     }

//     const fileType = getFileType(resource);

//     const author = await prisma.author.upsert({
//       where: { name: authorName },
//       update: {},
//       create: { name: authorName },
//     });

//     const category = await prisma.category.findUnique({
//       where: { slug: categorySlug },
//     });

//     if (!category) {
//       return NextResponse.json(
//         { message: "Selected category does not exist." },
//         { status: 404 }
//       );
//     }

//     let coverImage: string | undefined;

//     if (cover && cover.size > 0) {
//       const uploadedCover = await uploadToCloudinary(
//         cover,
//         "readora/covers",
//         "image"
//       );

//       coverImage = uploadedCover.secure_url;
//     }

//     const uploadedResource = await uploadToCloudinary(
//       resource,
//       "readora/resources",
//       getResourceType(fileType)
//     );

//     const book = await prisma.book.create({
//       data: {
//         title,
//         slug,
//         description,
//         coverImage,
//         authorId: author.id,
//         status:
//           status === "PUBLISHED"
//             ? BookStatus.PUBLISHED
//             : status === "ARCHIVED"
//               ? BookStatus.ARCHIVED
//               : BookStatus.DRAFT,
//         files: {
//           create: {
//             fileType,
//             fileUrl: uploadedResource.secure_url,
//             fileName: resource.name,
//             fileSize: resource.size,
//           },
//         },
//         categories: {
//           create: {
//             categoryId: category.id,
//           },
//         },
//       },
//       include: {
//         author: true,
//         files: true,
//         categories: {
//           include: {
//             category: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(
//       { message: "Book uploaded successfully.", book },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("UPLOAD_BOOK_ERROR", error);

//     return NextResponse.json(
//       { message: "Failed to upload book." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

type ReadoraFileType = "PDF" | "EPUB" | "DOCX" | "MP3" | "MP4";
type ReadoraBookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" | "raw"
) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        access_mode: "public",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
}

function getFileType(file: File): ReadoraFileType {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return "PDF";
  if (name.endsWith(".epub")) return "EPUB";
  if (name.endsWith(".docx")) return "DOCX";
  if (name.endsWith(".mp3")) return "MP3";
  if (name.endsWith(".mp4")) return "MP4";

  throw new Error("Unsupported file type.");
}

function getResourceType(fileType: ReadoraFileType): "video" | "raw" {
  if (fileType === "MP4" || fileType === "MP3") return "video";
  return "raw";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = String(formData.get("title") || "");
    const authorName = String(formData.get("author") || "");
    const categorySlug = String(formData.get("category") || "");
    const description = String(formData.get("description") || "");
    const status = String(formData.get("status") || "DRAFT").toUpperCase();

    const cover = formData.get("cover") as File | null;
    const resource = formData.get("resource") as File | null;

    if (!title || !authorName || !categorySlug || !resource) {
      return NextResponse.json(
        { message: "Title, author, category and resource file are required." },
        { status: 400 }
      );
    }

    const slug = slugify(title);

    const existingBook = await prisma.book.findUnique({
      where: { slug },
    });

    if (existingBook) {
      return NextResponse.json(
        { message: "A book with this title already exists." },
        { status: 409 }
      );
    }

    const fileType = getFileType(resource);

    const author = await prisma.author.upsert({
      where: { name: authorName },
      update: {},
      create: { name: authorName },
    });

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Selected category does not exist." },
        { status: 404 }
      );
    }

    let coverImage: string | undefined;

    if (cover && cover.size > 0) {
      const uploadedCover = await uploadToCloudinary(
        cover,
        "readora/covers",
        "image"
      );

      coverImage = uploadedCover.secure_url;
    }

    const uploadedResource = await uploadToCloudinary(
      resource,
      "readora/resources",
      getResourceType(fileType)
    );

    const safeStatus: ReadoraBookStatus =
      status === "PUBLISHED"
        ? "PUBLISHED"
        : status === "ARCHIVED"
        ? "ARCHIVED"
        : "DRAFT";

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        authorId: author.id,
        status: safeStatus,
        files: {
          create: {
            fileType,
            fileUrl: uploadedResource.secure_url,
            fileName: resource.name,
            fileSize: resource.size,
          },
        },
        categories: {
          create: {
            categoryId: category.id,
          },
        },
      },
      include: {
        author: true,
        files: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Book uploaded successfully.", book },
      { status: 201 }
    );
  } catch (error) {
    console.error("UPLOAD_BOOK_ERROR", error);

    return NextResponse.json(
      { message: "Failed to upload book." },
      { status: 500 }
    );
  }
}