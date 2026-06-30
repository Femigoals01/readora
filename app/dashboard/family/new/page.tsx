

import DashboardShell from "@/components/layout/DashboardShell";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewFamilyForm from "@/components/family/NewFamilyForm";

export default function NewFamilyPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/family"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <ArrowLeft size={18} />
          Back to Family Reading
        </Link>

        <section className="rounded-[2rem] bg-[#000D24] p-8 text-white shadow-2xl">
          <p className="font-bold text-emerald-300">
            Family Reading
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Create Family Group
          </h1>

          <p className="mt-3 text-slate-300">
            Build a reading culture with your spouse, children and loved ones.
          </p>
        </section>

        <NewFamilyForm />
      </div>
    </DashboardShell>
  );
}