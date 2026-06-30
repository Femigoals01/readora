"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteReadingListButton({
  listId,
}: {
  listId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteList() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reading list?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const res = await fetch("/api/reading-lists", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId }),
      });

      if (res.ok) {
        router.push("/dashboard/reading-lists");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={deleteList}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
    >
      <Trash2 size={18} />
      {loading ? "Deleting..." : "Delete List"}
    </button>
  );
}