



import DashboardNav from "@/components/layout/DashboardNav";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <DashboardNav />

      <div className="flex min-h-[calc(100vh-73px)] w-full items-stretch">
        <DashboardSidebar />

        <section className="min-w-0 flex-1 px-6 py-8">
          {children}
        </section>
      </div>
    </main>
  );
}