

// import Link from "next/link";
// import { ArrowLeft, Bot, Sparkles } from "lucide-react";
// import DashboardShell from "@/components/layout/DashboardShell";

// export default function AIReadingCoachPage() {
//   return (
//     // <main className="min-h-screen bg-[#F8FAFC] px-5 py-8 text-slate-950 md:px-8">
//         <DashboardShell>
//       <div className="mx-auto max-w-5xl">
//         <Link
//           href="/dashboard"
//           className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
//         >
//           <ArrowLeft size={18} />
//           Back to Dashboard
//         </Link>

//         <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
//           <p className="font-bold text-emerald-300">Future Feature</p>
//           <h1 className="mt-3 text-5xl font-black">AI Reading Coach</h1>
//           <p className="mt-3 max-w-2xl text-slate-300">
//             Ask questions, get chapter summaries, discover related Bible verses,
//             and understand books more deeply.
//           </p>
//         </section>

//         <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
//           <div className="flex items-center gap-3">
//             <Bot className="text-emerald-600" size={34} />
//             <h2 className="text-2xl font-black text-[#000D24]">
//               Ask Readora Coach
//             </h2>
//           </div>

//           <div className="mt-6 rounded-2xl bg-slate-50 p-5">
//             <p className="text-sm font-semibold text-slate-500">
//               Example prompts:
//             </p>

//             <div className="mt-4 grid gap-3">
//               {[
//                 "Summarize Chapter 5 for me",
//                 "What did this book teach about leadership?",
//                 "Give me Bible verses related to this chapter",
//                 "Create reflection questions from this book",
//               ].map((prompt) => (
//                 <div
//                   key={prompt}
//                   className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-bold text-slate-700"
//                 >
//                   <Sparkles size={16} className="text-amber-500" />
//                   {prompt}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <textarea
//             disabled
//             rows={5}
//             placeholder="AI connection coming soon..."
//             className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
//           />

//           <button
//             disabled
//             className="mt-4 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white opacity-60"
//           >
//             Ask Coach
//           </button>
//         </section>
//       </div>
//     </DashboardShell>
//   );
// }




import Link from "next/link";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import AiCoachChat from "@/components/ai-coach/AiCoachChat";

export default function AIReadingCoachPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-[#000D24]">
              <Bot size={30} />
            </div>

            <div>
              <p className="font-bold text-emerald-300">AI Reading Coach</p>
              <h1 className="mt-2 text-4xl font-black">
                Ask, learn and grow faster.
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-slate-300">
            Ask questions, get reflection prompts, understand difficult ideas,
            and receive practical reading guidance.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
            <Sparkles size={16} />
            First version: guided coaching response
          </div>
        </section>

        <AiCoachChat />
      </div>
    </DashboardShell>
  );
}