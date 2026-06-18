"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Layers,
  Map,
  Users,
  BellRing,
  Send,
  UploadCloud,
  Settings,
  Menu,
  X,
} from "lucide-react";

const ITEMS: { href: string; label: string; icon: typeof Layers }[] = [
  { href: "/",            label: "Overview",     icon: Layers },
  { href: "/map",         label: "Map",          icon: Map },
  { href: "/contractors", label: "Contractors",  icon: Users },
  { href: "/alerts",      label: "Alerts",       icon: BellRing },
  { href: "/upload",      label: "Upload",       icon: UploadCloud },
  { href: "/outreach",    label: "Outreach",     icon: Send },
  { href: "/settings",    label: "Settings",     icon: Settings },
];

function active(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-paper)]/85 backdrop-blur-md border-b border-[var(--color-ink)]/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center gap-6">
        {/* Logo lockup */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 grid place-items-center rounded-[5px] bg-[var(--color-ink)] text-[var(--color-paper)]">
            <span className="font-display text-[15px] leading-none tracking-tight">df</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-display text-[15px] tracking-tight">DF&amp;I Coverage</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)]/55 font-mono">
              by The Solution Service
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-2 hidden lg:flex items-center gap-1">
          {ITEMS.map((i) => {
            const a = active(pathname, i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                className={`relative px-2.5 py-1.5 text-[13px] inline-flex items-center gap-1.5 transition-colors ${
                  a ? "text-[var(--color-ink)]" : "text-[var(--color-ink)]/65 hover:text-[var(--color-ink)]"
                }`}
              >
                <i.icon className="h-3.5 w-3.5" />
                {i.label}
                {a && <span className="absolute left-2.5 right-2.5 -bottom-[18px] h-[2px] bg-[var(--color-brass)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden md:inline font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]/55">
            Preview &middot; fictional data
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase px-2 py-1 rounded-[3px] border border-[var(--color-brass)]/40 text-[var(--color-brass)] bg-[var(--color-brass-tint)]">
            Demo
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="lg:hidden p-2 -mr-2 text-[var(--color-ink)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* Scrim */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[var(--color-ink)]/40 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Sheet */}
        <aside
          className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-[var(--color-paper)] shadow-xl border-l border-[var(--color-ink)]/10 transform transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-ink)]/10">
            <div className="font-display text-[15px] tracking-tight">DF&amp;I Coverage</div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 -mr-2 text-[var(--color-ink)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="py-2">
            {ITEMS.map((i) => {
              const a = active(pathname, i.href);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  className={`flex items-center gap-3 px-5 py-3 text-[15px] border-b border-[var(--color-ink)]/5 ${
                    a
                      ? "text-[var(--color-ink)] bg-[var(--color-brass-tint)]"
                      : "text-[var(--color-ink)]/85"
                  }`}
                >
                  <i.icon className="h-4 w-4 text-[var(--color-steel)]" />
                  <span className="font-sans">{i.label}</span>
                  {a && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-brass)]" />}
                </Link>
              );
            })}
          </nav>
          <div className="px-5 py-4 text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--color-ink)]/55">
            Preview &middot; fictional data
          </div>
        </aside>
      </div>
    </header>
  );
}
