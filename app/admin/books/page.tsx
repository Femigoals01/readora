




import Link from "next/link";
import { ArrowLeft, BookOpen, Edit, Plus, Search, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SetBookOfTheMonthButton from "@/components/admin/SetBookOfTheMonthButton";


export const dynamic = "force-dynamic";

type AdminBook = {
  id: string;
  title: string;
  coverImage: string | null;
  status: string;
  isBookOfTheMonth: boolean;
  author: {
    name: string;
  } | null;
  files: {
    fileType: string;
  }[];
  categories: {
    category: {
      name: string;
    };
  }[];
};

export default async function AdminBooksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const books = (await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      files: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  })) as AdminBook[];

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Link href="/admin" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600">
              <ArrowLeft size={18} />
              Back to Admin
            </Link>

            <h1 className="text-4xl font-black text-[#000D24]">
              Books & Resources
            </h1>
          </div>

          <Link
            href="/admin/books/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
          >
            <Plus size={18} />
            Upload Resource
          </Link>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <Search size={20} className="text-slate-400" />
            <input
              placeholder="Search books, authors, categories..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  <th className="py-4">Book</th>
                  <th className="py-4">Author</th>
                  <th className="py-4">Type</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Featured</th>
                  <th className="py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => {
               
                  const type = book.files[0]?.fileType || "No File";
                  const category =
                    book.categories[0]?.category.name || "General";

                  return (
                    <tr key={book.id} className="border-b border-slate-100">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#000D24] text-white">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <BookOpen size={20} />
                            )}
                          </div>

                          <div>
                            <p className="font-black">{book.title}</p>
                            <p className="text-xs text-slate-500">{category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 text-sm font-semibold text-slate-600">
                        {book.author?.name || "Unknown Author"}
                      </td>

                      <td className="py-5 text-sm font-black text-slate-700">
                        {type}
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            book.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>

                      <td className="py-5">
                        <SetBookOfTheMonthButton
                          bookId={book.id}
                          isActive={book.isBookOfTheMonth}
                        />
                      </td>

                      <td className="py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/books/${book.id}/edit`}
                            className="rounded-xl bg-slate-100 p-3 text-slate-600"
                          >
                            <Edit size={16} />
                          </Link>

                          <button className="rounded-xl bg-red-50 p-3 text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}