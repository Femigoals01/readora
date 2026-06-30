import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewReadingListForm from "@/components/reading-lists/NewReadingListForm";

export default function NewReadingListPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/reading-lists"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Reading Lists
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">New Collection</p>
          <h1 className="mt-3 text-4xl font-black">Create Reading List</h1>
          <p className="mt-3 text-slate-300">
            Organize books by topic, purpose, family, ministry, or personal growth.
          </p>
        </section>

        <NewReadingListForm />
      </div>
    </DashboardShell>
  );
}