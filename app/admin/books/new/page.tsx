



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


import {
  ArrowLeft,
  Upload,
  BookOpen,
  Headphones,
  Video,
  FileText,
  Loader2,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function NewBookPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [description, setDescription] = useState("");

  const [cover, setCover] = useState<File | null>(null);
  const [resource, setResource] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();

      setCategories(data.categories || []);

      if (data.categories?.length) {
        setCategory(data.categories[0].slug);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("status", status);
      formData.append("description", description);

      if (cover) formData.append("cover", cover);
      if (resource) formData.append("resource", resource);

      const res = await fetch("/api/admin/books", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to upload resource.");
        return;
      }

      setMessage("Resource uploaded successfully.");

      setTitle("");
      setAuthor("");
      setDescription("");
      setCover(null);
      setResource(null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Admin
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl md:p-10">
          <p className="font-bold text-emerald-300">Content Upload</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Upload a New Resource
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Add books, audiobooks, videos, manuals, devotionals, study guides,
            or learning materials to Readora.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
        >
          {message && (
            <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black">Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Atomic Habits"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">Author</label>
              <input
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. James Clear"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
              >

                <option value="">
  {categories.length === 0 ? "No categories found" : "Select category"}
</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-black">Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <UploadBox
              title="Cover Image"
              description={cover ? cover.name : "PNG, JPG or WEBP"}
              icon={BookOpen}
              accept="image/*"
              onChange={setCover}
            />

            <UploadBox
              title="Main Resource"
              description={resource ? resource.name : "PDF, EPUB, DOCX, MP3 or MP4"}
              icon={FileText}
              accept=".pdf,.epub,.docx,.mp3,.mp4"
              onChange={setResource}
              required
            />

            <UploadBox
              title="Audiobook MP3"
              description="Use Main Resource for now"
              icon={Headphones}
              accept=".mp3"
              onChange={() => {}}
              disabled
            />

            <UploadBox
              title="Video MP4"
              description="Use Main Resource for now"
              icon={Video}
              accept=".mp4"
              onChange={() => {}}
              disabled
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            {/* <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Uploading..." : "Publish Resource"}
            </button> */}


            <button
  type="submit"
  disabled={loading || !category}
  className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
>
  {loading && <Loader2 size={18} className="animate-spin" />}
  {loading ? "Uploading..." : "Publish Resource"}
</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function UploadBox({
  title,
  description,
  icon: Icon,
  accept,
  onChange,
  required = false,
  disabled = false,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  accept: string;
  onChange: (file: File | null) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={`block rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        type="file"
        accept={accept}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Icon size={24} />
      </div>

      <h3 className="mt-4 font-black">{title}</h3>
      <p className="mt-1 break-words text-sm text-slate-500">{description}</p>

      <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#000D24] shadow-sm">
        <Upload size={16} />
        Choose File
      </span>
    </label>
  );
}