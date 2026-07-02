

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Home,
//   BookOpen,
//   Trophy,
//   User,
//   Library,
// } from "lucide-react";

// const links = [
//   {
//     label: "Home",
//     href: "/dashboard",
//     icon: Home,
//   },
//   {
//     label: "Library",
//     href: "/dashboard/my-library",
//     icon: BookOpen,
//   },
//   {
//     label: "Browse",
//     href: "/library",
//     icon: Library,
//   },
//   {
//     label: "Rewards",
//     href: "/dashboard/badges",
//     icon: Trophy,
//   },
//   {
//     label: "Profile",
//     href: "/dashboard/profile",
//     icon: User,
//   },
// ];

// export default function MobileBottomNav() {
//   const pathname = usePathname();

//   return (
//     <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-3xl bg-[#000D24] p-3 shadow-2xl lg:hidden">
//       <div className="flex justify-around">
//         {links.map((item) => {
//           const Icon = item.icon;

//           const active =
//             pathname === item.href;

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex flex-col items-center gap-1 text-xs ${
//                 active
//                   ? "text-emerald-400"
//                   : "text-slate-300"
//               }`}
//             >
//               <Icon size={20} />
//               {item.label}
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }




"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Library, Trophy, Bot } from "lucide-react";

const links = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Library", href: "/dashboard/my-library", icon: BookOpen },
  { label: "Browse", href: "/library", icon: Library },
  { label: "Rewards", href: "/dashboard/badges", icon: Trophy },
  { label: "Coach", href: "/dashboard/ai-coach", icon: Bot },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-[2rem] border border-white/10 bg-[#000D24]/95 p-3 shadow-2xl backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition ${
                active
                  ? "bg-emerald-400 text-[#000D24]"
                  : "text-slate-300"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}