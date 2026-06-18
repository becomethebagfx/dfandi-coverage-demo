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
  Settings as SettingsIcon,
  Menu,
  X,
} from "lucide-react";

/** Primary nav (visible at lg+). Settings is intentionally NOT in this list
 *  to keep the bar from overflowing; it lives as a gear icon on the right. */
const MAIN: { href: string; label: string; icon: typeof Layers }[] = [
  { href: "/",            label: "Overview",    icon: Layers },
  { href: "/contractors", label: "Contractors", icon: Users },
  { href: "/alerts",      label: "Alerts",      icon: BellRing },
  { href: "/upload",      label: "Upload",      icon: UploadCloud },
  { href: "/outreach",    label: "Outreach",    icon: Send },
];

/** Full set used in the mobile sheet (Map + Settings included). */
const ALL: { href: string; label: string; icon: typeof Layers }[] = [
  { href: "/",            label: "Overview",    icon: Layers },
  { href: "/map",         label: "Map",         icon: Map },
  { href: "/contractors", label: "Contractors", icon: Users },
  { href: "/alerts",      label: "Alerts",      icon: BellRing },
  { href: "/upload",      label: "Upload",      icon: UploadCloud },
  { href: "/outreach",    label: "Outreach",    icon: Send },
  { href: "/settings",    label: "Settings",    icon: SettingsIcon },
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
    <header className="sticky top-0 z-40 bg-[var(--color-paper)]/90 backdrop-blur-md border-b border-[var(--color-ink)]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3 sm:gap-5">
        {/* Logo lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="h-9 w-9 grid place-items-center rounded-[5px] bg-[var(--color-ink)] text-[var(--color-paper)]">
            <span className="font-display text-[15px] leading-none tracking-tight">df</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-display text-[15px] tracking-tight">DF&amp;I Coverage</div>
            <div className="text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-ink)]/55 font-mono">
              The Solution Service
            </div>
          </div>
        </Link>

        {/* Desktop nav: only the 5 main items. Settings is the gear on the right. */}
        <nav className="hidden lg:flex items-center gap-0.5 ml-2">
          {MAIN.map((i) => {
            const a = active(pathname, i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                className={`relative px-2.5 py-1.5 text-[13px] inline-flex items-center gap-1.5 rounded-[3px] transition-colors ${
                  a ? "text-[var(--color-ink)]" : "text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]"
                }`}
              >
                <i.icon className="h-3.5 w-3.5" />
                <span>{i.label}</span>
                {a && <span className="absolute left-2.5 right-2.5 -bottom-[18px] h-[2px] bg-[var(--color-brass)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden xl:inline font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]/55">
            Preview &middot; fictional data
          </span>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.22em] uppercase px-2 py-1 rounded-[3px] border border-[var(--color-brass)]/40 text-[var(--color-brass)] bg-[var(--color-brass-tint)]">
            Demo
          </span>
          {/* Settings gear (desktop only). On mobile the drawer covers it. */}
          <Link
            href="/settings"
            aria-label="Settings"
            className={`hidden lg:inline-flex p-2 rounded-[3px] text-[var(--color-ink)]/70 hover:text-[var(--color-ink)] hover:bg-[var(--color-ink)]/5 ${
              active(pathname, "/settings") ? "text-[var(--color-ink)] bg-[var(--color-ink)]/5" : ""
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>
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
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[var(--color-ink)]/40 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[86%] max-w-sm bg-[var(--color-paper)] shadow-xl border-l border-[var(--color-ink)]/10 transform transition-transform duration-200 ${
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
            {ALL.map((i) => {
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
                  <span>{i.label}</span>
                  {a && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-brass)]" />}
                </Link>
              );
            })}
          </nav>
          <div className="px-5 py-4 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ink)]/55">
            Preview &middot; fictional data
          </div>
        </aside>
      </div>
    </header>
  );
}
