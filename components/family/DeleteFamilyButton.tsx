


"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteFamilyButton({ familyId }: { familyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteFamily() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this family group?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      const res = await fetch("/api/families", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyId }),
      });

      if (res.ok) {
        router.push("/dashboard/family");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={deleteFamily}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
    >
      <Trash2 size={18} />
      {loading ? "Deleting..." : "Delete Family"}
    </button>
  );
}