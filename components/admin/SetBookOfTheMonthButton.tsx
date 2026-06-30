"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

export default function SetBookOfTheMonthButton({
  bookId,
  isActive,
}: {
  bookId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setBookOfTheMonth() {
    if (isActive) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/books/${bookId}/book-of-the-month`, {
        method: "PATCH",
      });

      if (!res.ok) {
        alert("Failed to update Book of the Month.");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={setBookOfTheMonth}
      disabled={loading || isActive}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black transition ${
        isActive
          ? "bg-amber-100 text-amber-700"
          : "bg-[#000D24] text-white hover:bg-slate-800"
      }`}
    >
      <Star size={16} fill={isActive ? "currentColor" : "none"} />
      {isActive
        ? "Book of the Month"
        : loading
        ? "Updating..."
        : "Set as Book of the Month"}
    </button>
  );
}