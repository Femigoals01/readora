



// import DashboardNav from "@/components/layout/DashboardNav";
// import DashboardSidebar from "@/components/layout/DashboardSidebar";

// export default function DashboardShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
//       <DashboardNav />

//       <div className="flex min-h-[calc(100vh-73px)] w-full items-stretch">
//         <DashboardSidebar />

//         <section className="min-w-0 flex-1 px-6 py-8">
//           {children}
//         </section>
//       </div>
//     </main>
//   );
// }




// import DashboardNav from "@/components/layout/DashboardNav";
// import DashboardSidebar from "@/components/layout/DashboardSidebar";

// export default function DashboardShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
//       <DashboardNav />

//       <div className="flex min-h-[calc(100vh-73px)] w-full">
//         <aside className="hidden shrink-0 lg:block">
//           <DashboardSidebar />
//         </aside>

//         <section className="min-w-0 flex-1 px-4 py-6 sm:px-5 md:px-6 lg:px-8 lg:py-8">
//           {children}
//         </section>
//       </div>
//     </main>
//   );
// }



// import DashboardNav from "@/components/layout/DashboardNav";
// import DashboardSidebar from "@/components/layout/DashboardSidebar";
// import MobileBottomNav from "./MobileBottomNav";

// export default function DashboardShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
//       <DashboardNav />

//       <div className="flex min-h-[calc(100vh-73px)] w-full">
//         <aside className="hidden lg:block">
//           <DashboardSidebar />
//         </aside>

//         <section className="min-w-0 flex-1 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-8 pb-24 lg:pb-8">
//           {children}
//         </section>
//       </div>
//       <MobileBottomNav />
//     </main>
//   );
// }



import DashboardNav from "@/components/layout/DashboardNav";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <DashboardNav />

      <div className="flex min-h-[calc(100vh-73px)] w-full">
        <aside className="hidden shrink-0 lg:block">
          <DashboardSidebar />
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 pb-28 sm:px-5 md:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </section>
      </div>

      <MobileBottomNav />
    </main>
  );
}