

import AppNavbar from "@/components/layout/AppNavbar";
import SiteFooter from "@/components/layout/SiteFooter";

export default function PublicShell({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <AppNavbar />
      {children}
      {showFooter && <SiteFooter />}
    </main>
  );
}