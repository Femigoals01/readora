

"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [loading, setLoading] = useState(false);

  async function deleteReview() {
    setLoading(true);

    try {
      const res = await fetch("/api/book-reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={deleteReview}
      disabled={loading}
      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-60"
    >
      <Trash2 size={14} />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}