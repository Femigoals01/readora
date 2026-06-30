

"use client";

import { useState } from "react";
import { BookmarkX } from "lucide-react";

export default function UnsaveBookButton({ bookSlug }: { bookSlug: string }) {
  const [removed, setRemoved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function unsaveBook() {
    setLoading(true);

    try {
      const res = await fetch("/api/saved-books", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookSlug }),
      });

      if (res.ok) {
        setRemoved(true);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  if (removed) return null;

  return (
    <button
      onClick={unsaveBook}
      disabled={loading}
      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-black text-red-600 disabled:opacity-70"
    >
      <BookmarkX size={16} />
      {loading ? "Removing..." : "Remove from Saved"}
    </button>
  );
}