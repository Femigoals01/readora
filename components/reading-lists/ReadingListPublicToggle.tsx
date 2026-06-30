

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe2, Lock } from "lucide-react";

export default function ReadingListPublicToggle({
  listId,
  initialPublic,
}: {
  listId: string;
  initialPublic: boolean;
}) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [loading, setLoading] = useState(false);

  async function togglePublic() {
    setLoading(true);

    const nextValue = !isPublic;

    try {
      const res = await fetch("/api/reading-lists/toggle-public", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId,
          public: nextValue,
        }),
      });

      if (res.ok) {
        setIsPublic(nextValue);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={togglePublic}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#000D24] disabled:opacity-60"
    >
      {isPublic ? <Globe2 size={18} /> : <Lock size={18} />}
      {loading ? "Updating..." : isPublic ? "Public" : "Private"}
    </button>
  );
}