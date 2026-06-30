

"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteFamilyGoalButton({
  goalId,
}: {
  goalId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteGoal() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this family goal?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const res = await fetch("/api/families/goals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId }),
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
      onClick={deleteGoal}
      disabled={loading}
      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-60"
    >
      <Trash2 size={14} />
      {loading ? "Deleting..." : "Delete Goal"}
    </button>
  );
}