




import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-[#000D24] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/readoralogo.png"
                alt="Readora"
                width={38}
                height={38}
                className="rounded-xl"
              />
              <span className="text-2xl font-black text-white">Readora</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Read. Learn. Grow.
            </p>
          </div>

          <FooterColumn
            title="Explore"
            links={[
              ["Home", "/"],
              ["Library", "/library"],
              ["Categories", "/categories"],
              ["Challenges", "/challenges"],
            ]}
          />

          <FooterColumn
            title="Support"
            links={[
              ["Help Center", "/help"],
              ["Contact Us", "/contact"],
              ["Privacy Policy", "/privacy"],
              ["Terms of Service", "/terms"],
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              ["About Us", "/about"],
              ["Blog", "/blog"],
              ["Careers", "/careers"],
              ["Press", "/press"],
            ]}
          />

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Stay Connected
            </h4>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Get the latest updates and reading tips.
            </p>

            <div className="mt-5 flex h-12 max-w-sm overflow-hidden rounded-xl border border-slate-700 bg-white/5">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent text-center text-sm text-white placeholder:text-slate-500 outline-none"
              />

              <button className="flex w-12 shrink-0 items-center justify-center bg-emerald-400 text-[#000D24] transition hover:bg-emerald-300">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-5 text-sm text-slate-400">
              <Link href="#" className="transition hover:text-white">
                FaceBook
              </Link>
              <Link href="#" className="transition hover:text-white">
                Instagram
              </Link>
              <Link href="#" className="transition hover:text-white">
                YouTube
              </Link>
              <Link href="#" className="transition hover:text-white">
                <Mail size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Insight Hub Solutions Limited. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className="rounded-full px-2 py-1 transition hover:bg-slate-900 hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="rounded-full px-2 py-1 transition hover:bg-slate-900 hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/help"
              className="rounded-full px-2 py-1 transition hover:bg-slate-900 hover:text-white"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
        {title}
      </h4>

      <ul className="space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}