"use client";

import { Download } from "lucide-react";

export default function CertificatePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-[#000D24] px-6 py-3 text-sm font-black text-white print:hidden"
    >
      <Download size={18} />
      Download / Print Certificate
    </button>
  );
}