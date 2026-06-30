

"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export default function CopyReadingListLinkButton({ listId }: { listId: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/readlists/${listId}`;
    await navigator.clipboard.writeText(url);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copyLink}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-[#000D24]"
    >
      <Copy size={18} />
      {copied ? "Copied!" : "Copy Share Link"}
    </button>
  );
}