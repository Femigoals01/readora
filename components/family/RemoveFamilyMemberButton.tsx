
"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveFamilyMemberButton({
  familyId,
  memberId,
}: {
  familyId: string;
  memberId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeMember() {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this family member?"
    );

    if (!confirmRemove) return;

    setLoading(true);

    try {
      const res = await fetch("/api/families/remove-member", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId,
          memberId,
        }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={removeMember}
      disabled={loading}
      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-60"
    >
      <Trash2 size={14} />
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}