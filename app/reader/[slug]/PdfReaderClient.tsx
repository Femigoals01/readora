



// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import {
//     ArrowLeft,
//     Bookmark,
//     Highlighter,
//     MessageSquareText,
//     Minus,
//     Plus,
//     Settings,
// } from "lucide-react";

// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";


// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// type ReaderBook = {
//     title: string;
//     slug: string;
//     author: string;
//     fileUrl: string;
//     fileType: string;
//     startPage: number;
// };

// export default function PdfReaderClient({ book }: { book: ReaderBook }) {
//     const [numPages, setNumPages] = useState<number>(0);
//     //   const [pageNumber, setPageNumber] = useState(1);
//     const [pageNumber, setPageNumber] = useState(book.startPage || 1);
//     const [scale, setScale] = useState(1.05);

//     const [reflectionOpen, setReflectionOpen] = useState(false);
//     const [reflection, setReflection] = useState("");
//     const [reflectionMessage, setReflectionMessage] = useState("");
//     const [reflectionError, setReflectionError] = useState("");
//     const [reflectionLoading, setReflectionLoading] = useState(false);
//     const [noteOpen, setNoteOpen] = useState(false);
//     const [note, setNote] = useState("");
//     const [noteMessage, setNoteMessage] = useState("");
//     const [noteLoading, setNoteLoading] = useState(false);

//     async function saveProgress(page: number, total: number) {
//         if (!total) return;

//         await fetch("/api/reading-progress", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 bookSlug: book.slug,
//                 currentPage: page,
//                 totalPages: total,
//             }),
//         });
//     }


//     async function submitReflection() {
//         setReflectionMessage("");
//         setReflectionError("");
//         setReflectionLoading(true);

//         try {
//             const res = await fetch("/api/reflections", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     bookSlug: book.slug,
//                     content: reflection,
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setReflectionError(data.message || "Failed to save reflection.");
//                 return;
//             }

//             setReflection("");
//             setReflectionMessage("Reflection saved. You earned 40 XP.");
//         } catch {
//             setReflectionError("Something went wrong.");
//         } finally {
//             setReflectionLoading(false);
//         }
//     }


//     async function saveNote() {
//   if (!note.trim()) return;

//   setNoteLoading(true);

//   try {
//     const res = await fetch("/api/notes", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//   bookSlug: book.slug,
//   page: pageNumber,
//   content: note,
// }),
//     });

//     if (!res.ok) {
//       throw new Error();
//     }

//     setNote("");
//     setNoteMessage("Note saved.");
//   } catch {
//     setNoteMessage("Failed to save note.");
//   } finally {
//     setNoteLoading(false);
//   }
// }


//     const isPdf = book.fileType === "PDF";

//     return (
//         <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
//             <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
//                 <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
//                     <Link
//                         href={`/library/${book.slug}`}
//                         className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//                     >
//                         <ArrowLeft size={18} />
//                         Back
//                     </Link>

//                     <div className="text-center">
//                         <h1 className="text-sm font-black md:text-base">{book.title}</h1>
//                         <p className="text-xs text-slate-500">
//                             Page {pageNumber} of {numPages || "..."}
//                         </p>
//                     </div>

//                     <button className="rounded-xl bg-[#000D24] p-3 text-white">
//                         <Settings size={18} />
//                     </button>
//                 </div>
//             </header>

//             <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_280px]">
//                 <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:p-8">
//                     {!isPdf ? (
//                         <div className="rounded-3xl bg-slate-50 p-10 text-center">
//                             <h2 className="text-2xl font-black text-[#000D24]">
//                                 Preview not available
//                             </h2>
//                             <p className="mt-3 text-sm text-slate-500">
//                                 This reader currently supports PDF files. You can download this
//                                 resource instead.
//                             </p>

//                             <a
//                                 href={book.fileUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
//                             >
//                                 Download Resource
//                             </a>
//                         </div>
//                     ) : (
//                         <div className="flex justify-center overflow-x-auto rounded-3xl bg-slate-100 p-4">
//                             <Document
//                                 file={book.fileUrl}
//                                 onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                                 loading={
//                                     <p className="py-20 text-center text-sm font-bold text-slate-500">
//                                         Loading PDF...
//                                     </p>
//                                 }
//                                 error={
//                                     <div className="rounded-2xl bg-red-50 p-6 text-center text-sm font-bold text-red-700">
//                                         Could not load PDF. The file may need Cloudinary raw access
//                                         settings or a direct file URL.
//                                     </div>
//                                 }
//                             >
//                                 <Page pageNumber={pageNumber} scale={scale} />
//                             </Document>
//                         </div>
//                     )}

//                     {isPdf && (
//                         <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
//                             <button
//                                 disabled={pageNumber <= 1}
//                                 // onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
//                                 onClick={() => {
//                                     const newPage = Math.max(1, pageNumber - 1);
//                                     setPageNumber(newPage);
//                                     saveProgress(newPage, numPages);
//                                 }}
//                                 className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-40"
//                             >
//                                 Previous
//                             </button>

//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={() => setScale((value) => Math.max(0.8, value - 0.1))}
//                                     className="rounded-xl bg-slate-100 p-3"
//                                 >
//                                     <Minus size={18} />
//                                 </button>

//                                 <button
//                                     onClick={() => setScale((value) => Math.min(1.6, value + 0.1))}
//                                     className="rounded-xl bg-slate-100 p-3"
//                                 >
//                                     <Plus size={18} />
//                                 </button>
//                             </div>

//                             <button
//                                 disabled={pageNumber >= numPages}
//                                 // onClick={() =>
//                                 //   setPageNumber((page) => Math.min(numPages, page + 1))
//                                 // }

//                                 onClick={() => {
//                                     const newPage = Math.min(numPages, pageNumber + 1);
//                                     setPageNumber(newPage);
//                                     saveProgress(newPage, numPages);
//                                 }}
//                                 className="rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </article>

//                 <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
//                     <h2 className="mb-5 font-black">Reader Tools</h2>

//                     <div className="grid gap-3">
//                         <button className="flex items-center gap-3 rounded-xl bg-[#000D24] px-4 py-3 text-sm font-bold text-white">
//                             <Bookmark size={18} />
//                             Bookmark Page
//                         </button>

//                         <button className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
//                             <Highlighter size={18} />
//                             Highlight Text
//                         </button>

//                         {/* <button className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
//                             <MessageSquareText size={18} />
//                             Add Reflection
//                         </button> */}

//                         <button
//                             onClick={() => setReflectionOpen((value) => !value)}
//                             className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
//                         >
//                             <MessageSquareText size={18} />
//                             Add Reflection
//                         </button>

//                         <button
//   onClick={() => setNoteOpen(!noteOpen)}
//   className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"
// >
//   📝 Notes
// </button>


//                         {reflectionOpen && (
//                             <div className="mt-5 rounded-2xl bg-slate-50 p-4">
//                                 <p className="text-sm font-black text-[#000D24]">
//                                     What did this book teach you?
//                                 </p>

//                                 <textarea
//                                     value={reflection}
//                                     onChange={(e) => setReflection(e.target.value)}
//                                     rows={5}
//                                     placeholder="Write your reflection..."
//                                     className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
//                                 />

//                                 {reflectionMessage && (
//                                     <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
//                                         {reflectionMessage}
//                                     </p>
//                                 )}

//                                 {reflectionError && (
//                                     <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
//                                         {reflectionError}
//                                     </p>
//                                 )}

//                                 <button
//                                     onClick={submitReflection}
//                                     disabled={reflectionLoading}
//                                     className="mt-4 w-full rounded-xl bg-[#000D24] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
//                                 >
//                                     {reflectionLoading ? "Saving..." : "Save Reflection"}
//                                 </button>
//                             </div>
//                         )}



//                         {noteOpen && (
//   <div className="mt-5 rounded-2xl bg-slate-50 p-4">
//     <p className="text-sm font-black">
//       Save a note from this page
//     </p>

//     <textarea
//       rows={4}
//       value={note}
//       onChange={(e) => setNote(e.target.value)}
//       className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
//       placeholder="Write your note..."
//     />

//     {noteMessage && (
//       <p className="mt-3 text-sm font-bold text-emerald-600">
//         {noteMessage}
//       </p>
//     )}

//     <button
//       onClick={saveNote}
//       disabled={noteLoading}
//       className="mt-4 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
//     >
//       {noteLoading ? "Saving..." : "Save Note"}
//     </button>
//   </div>
// )}
//                     </div>

//                     <div className="mt-8 rounded-2xl bg-slate-50 p-5">
//                         <p className="text-sm font-black">Reading Progress</p>
//                         <p className="mt-2 text-3xl font-black text-[#000D24]">
//                             {numPages ? Math.round((pageNumber / numPages) * 100) : 0}%
//                         </p>

//                         <div className="mt-4 h-2 rounded-full bg-slate-200">
//                             <div
//                                 className="h-2 rounded-full bg-emerald-400"
//                                 style={{
//                                     width: `${numPages ? (pageNumber / numPages) * 100 : 0}%`,
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 </aside>
//             </section>
//         </main>
//     );
// }




"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ArrowLeft,
  Bookmark,
  Highlighter,
  MessageSquareText,
  Minus,
  Plus,
  Settings,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ReaderBook = {
  title: string;
  slug: string;
  author: string;
  fileUrl: string;
  fileType: string;
  startPage: number;
};

export default function PdfReaderClient({ book }: { book: ReaderBook }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(book.startPage || 1);
  const [scale, setScale] = useState(1.05);

  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflection, setReflection] = useState("");
  const [reflectionMessage, setReflectionMessage] = useState("");
  const [reflectionError, setReflectionError] = useState("");
  const [reflectionLoading, setReflectionLoading] = useState(false);

  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [bookmarkMessage, setBookmarkMessage] = useState("");
const [bookmarkLoading, setBookmarkLoading] = useState(false);

  async function saveProgress(page: number, total: number) {
    if (!total) return;

    await fetch("/api/reading-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookSlug: book.slug,
        currentPage: page,
        totalPages: total,
      }),
    });
  }

  useEffect(() => {
    if (!numPages) return;

    const timer = setTimeout(() => {
      saveProgress(pageNumber, numPages);
    }, 800);

    return () => clearTimeout(timer);
  }, [pageNumber, numPages]);


  async function saveBookmark() {
  setBookmarkMessage("");
  setBookmarkLoading(true);

  try {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookSlug: book.slug,
        page: pageNumber,
      }),
    });

    if (!res.ok) {
      throw new Error();
    }

    setBookmarkMessage(`Page ${pageNumber} bookmarked.`);
  } catch {
    setBookmarkMessage("Failed to save bookmark.");
  } finally {
    setBookmarkLoading(false);
  }
}

  async function submitReflection() {
    setReflectionMessage("");
    setReflectionError("");
    setReflectionLoading(true);

    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookSlug: book.slug,
          content: reflection,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReflectionError(data.message || "Failed to save reflection.");
        return;
      }

      setReflection("");
      setReflectionMessage("Reflection saved. You earned 40 XP.");
    } catch {
      setReflectionError("Something went wrong.");
    } finally {
      setReflectionLoading(false);
    }
  }

  async function saveNote() {
    if (!note.trim()) return;

    setNoteLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookSlug: book.slug,
          page: pageNumber,
          content: note,
        }),
      });

      if (!res.ok) throw new Error();

      setNote("");
      setNoteMessage("Note saved.");
    } catch {
      setNoteMessage("Failed to save note.");
    } finally {
      setNoteLoading(false);
    }
  }

  const isPdf = book.fileType === "PDF";

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            href={`/library/${book.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <div className="text-center">
            <h1 className="text-sm font-black md:text-base">{book.title}</h1>
            <p className="text-xs text-slate-500">
              Page {pageNumber} of {numPages || "..."}
            </p>
          </div>

          <button className="rounded-xl bg-[#000D24] p-3 text-white">
            <Settings size={18} />
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:px-8 lg:grid-cols-[1fr_280px]">
        <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:p-8">
          {!isPdf ? (
            <div className="rounded-3xl bg-slate-50 p-10 text-center">
              <h2 className="text-2xl font-black text-[#000D24]">
                Preview not available
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                This reader currently supports PDF files. You can download this
                resource instead.
              </p>

              <a
                href={book.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-black text-[#000D24]"
              >
                Download Resource
              </a>
            </div>
          ) : (
            <div className="flex justify-center overflow-x-auto rounded-3xl bg-slate-100 p-4">
              <Document
                file={book.fileUrl}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  const safePage = Math.min(Math.max(book.startPage || 1, 1), numPages);
                  setPageNumber(safePage);
                }}
                loading={
                  <p className="py-20 text-center text-sm font-bold text-slate-500">
                    Loading PDF...
                  </p>
                }
                error={
                  <div className="rounded-2xl bg-red-50 p-6 text-center text-sm font-bold text-red-700">
                    Could not load PDF. The file may need Cloudinary raw access
                    settings or a direct file URL.
                  </div>
                }
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            </div>
          )}

          {isPdf && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale((value) => Math.max(0.8, value - 0.1))}
                  className="rounded-xl bg-slate-100 p-3"
                >
                  <Minus size={18} />
                </button>

                <button
                  onClick={() => setScale((value) => Math.min(1.6, value + 0.1))}
                  className="rounded-xl bg-slate-100 p-3"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                disabled={pageNumber >= numPages}
                onClick={() =>
                  setPageNumber((page) => Math.min(numPages, page + 1))
                }
                className="rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </article>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-black">Reader Tools</h2>

          <div className="grid gap-3">
            {/* <button className="flex items-center gap-3 rounded-xl bg-[#000D24] px-4 py-3 text-sm font-bold text-white">
              <Bookmark size={18} />
              Bookmark Page
            </button> */}

            <button
  onClick={saveBookmark}
  disabled={bookmarkLoading}
  className="flex items-center gap-3 rounded-xl bg-[#000D24] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
>
  <Bookmark size={18} />
  {bookmarkLoading ? "Saving..." : "Bookmark Page"}
</button>

{bookmarkMessage && (
  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
    {bookmarkMessage}
  </p>
)}

            <button className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
              <Highlighter size={18} />
              Highlight Text
            </button>

            <button
              onClick={() => setReflectionOpen((value) => !value)}
              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
            >
              <MessageSquareText size={18} />
              Add Reflection
            </button>

            <button
              onClick={() => setNoteOpen(!noteOpen)}
              className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"
            >
              📝 Notes
            </button>

            {reflectionOpen && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-[#000D24]">
                  What did this book teach you?
                </p>

                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={5}
                  placeholder="Write your reflection..."
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />

                {reflectionMessage && (
                  <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                    {reflectionMessage}
                  </p>
                )}

                {reflectionError && (
                  <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                    {reflectionError}
                  </p>
                )}

                <button
                  onClick={submitReflection}
                  disabled={reflectionLoading}
                  className="mt-4 w-full rounded-xl bg-[#000D24] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
                >
                  {reflectionLoading ? "Saving..." : "Save Reflection"}
                </button>
              </div>
            )}

            {noteOpen && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black">Save a note from this page</p>

                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Write your note..."
                />

                {noteMessage && (
                  <p className="mt-3 text-sm font-bold text-emerald-600">
                    {noteMessage}
                  </p>
                )}

                <button
                  onClick={saveNote}
                  disabled={noteLoading}
                  className="mt-4 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white"
                >
                  {noteLoading ? "Saving..." : "Save Note"}
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-black">Reading Progress</p>
            <p className="mt-2 text-3xl font-black text-[#000D24]">
              {numPages ? Math.round((pageNumber / numPages) * 100) : 0}%
            </p>

            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{
                  width: `${numPages ? (pageNumber / numPages) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}