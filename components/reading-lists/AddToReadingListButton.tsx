"use client";

import { useEffect, useState } from "react";
import { ListPlus } from "lucide-react";

type ReadingList = {
  id: string;
  name: string;
};

export default function AddToReadingListButton({
  bookSlug,
}: {
  bookSlug: string;
}) {
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [listId, setListId] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLists() {
      const res = await fetch("/api/reading-lists");
      const data = await res.json();

      if (res.ok) {
        setLists(data.lists || []);
      }
    }

    loadLists();
  }, []);

  async function addToList() {
    if (!listId) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reading-lists/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId,
          bookSlug,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Added to list.");
      } else {
        setMessage(data.message || "Failed to add.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-4 text-sm font-black text-white sm:w-auto"
      >
        <ListPlus size={18} />
        Add to List
      </button>

      {open && (
        <div className="mt-3 rounded-2xl bg-white p-4 text-slate-900 shadow-xl">
          {lists.length === 0 ? (
            <p className="text-sm font-bold text-slate-500">
              Create a reading list first.
            </p>
          ) : (
            <>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="">Choose list</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>

              <button
                onClick={addToList}
                disabled={loading || !listId}
                className="mt-3 w-full rounded-xl bg-[#000D24] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {loading ? "Adding..." : "Add Book"}
              </button>
            </>
          )}

          {message && (
            <p className="mt-3 text-xs font-black text-emerald-600">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}