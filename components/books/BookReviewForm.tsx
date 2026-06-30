


// "use client";

// import { useState } from "react";
// import { Star } from "lucide-react";

// export default function BookReviewForm({ bookSlug }: { bookSlug: string }) {
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function submitReview() {
//     setMessage("");
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/book-reviews", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           bookSlug,
//           rating,
//           comment,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Failed to submit review.");
//         return;
//       }

//       setMessage(data.message || "Review submitted.");
//       setComment("");
//       window.location.reload();
//     } catch {
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mt-8 rounded-2xl bg-slate-50 p-5">
//       <h3 className="font-black text-[#000D24]">Write a Review</h3>

//       <div className="mt-4 flex gap-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => setRating(star)}
//             className="text-amber-400"
//           >
//             <Star
//               size={22}
//               fill={star <= rating ? "currentColor" : "none"}
//             />
//           </button>
//         ))}
//       </div>

//       <textarea
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         rows={4}
//         placeholder="Write your review..."
//         className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
//       />

//       {message && (
//         <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
//           {message}
//         </p>
//       )}

//       {error && (
//         <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
//           {error}
//         </p>
//       )}

//       <button
//         onClick={submitReview}
//         disabled={loading}
//         className="mt-4 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
//       >
//         {loading ? "Submitting..." : "Submit Review"}
//       </button>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function BookReviewForm({
  bookSlug,
  existingReview,
}: {
  bookSlug: string;
  existingReview?: {
    rating: number;
    comment: string;
  } | null;
}) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReview() {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/book-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookSlug,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to submit review.");
        return;
      }

      setMessage(data.message || "Review submitted.");
      window.location.reload();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl bg-slate-50 p-5">
      <h3 className="font-black text-[#000D24]">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-amber-400"
          >
            <Star size={22} fill={star <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Write your review..."
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
      />

      {message && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <button
        onClick={submitReview}
        disabled={loading}
        className="mt-4 rounded-xl bg-[#000D24] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
      >
        {loading
          ? existingReview
            ? "Updating..."
            : "Submitting..."
          : existingReview
            ? "Update Review"
            : "Submit Review"}
      </button>
    </div>
  );
}