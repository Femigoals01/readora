

"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveFromReadingListButton({
  listId,
  bookId,
}: {
  listId: string;
  bookId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeBook() {
    setLoading(true);

    try {
      const res = await fetch(
        "/api/reading-lists/remove-book",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listId,
            bookId,
          }),
        }
      );

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={removeBook}
      disabled={loading}
      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-black text-red-600"
    >
      <Trash2 size={14} />

      {loading
        ? "Removing..."
        : "Remove from List"}
    </button>
  );
}