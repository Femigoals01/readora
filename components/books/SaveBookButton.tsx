// "use client";

// import { useState } from "react";
// import { Bookmark } from "lucide-react";

// export default function SaveBookButton({ bookSlug }: { bookSlug: string }) {
//   const [saved, setSaved] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function saveBook() {
//     setLoading(true);

//     try {
//       const res = await fetch("/api/saved-books", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ bookSlug }),
//       });

//       if (res.ok) {
//         setSaved(true);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       onClick={saveBook}
//       disabled={loading || saved}
//       className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-black text-white disabled:opacity-70"
//     >
//       <Bookmark size={18} />
//       {saved ? "Saved" : loading ? "Saving..." : "Save"}
//     </button>
//   );
// }





"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

export default function SaveBookButton({
  bookSlug,
  initiallySaved = false,
}: {
  bookSlug: string;
  initiallySaved?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function saveBook() {
    setLoading(true);

    try {
      const res = await fetch("/api/saved-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookSlug }),
      });

      if (res.ok) {
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={saveBook}
      disabled={loading || saved}
      className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-black text-white disabled:opacity-70"
    >
      <Bookmark size={18} />
      {saved ? "Saved" : loading ? "Saving..." : "Save"}
    </button>
  );
}