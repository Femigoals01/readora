

"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-4 py-3 text-xs font-black text-white"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}