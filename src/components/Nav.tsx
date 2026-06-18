import Link from "next/link";
import { MapPinned, LayoutDashboard, Users, BellRing, Send } from "lucide-react";

const ITEMS = [
  { href: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { href: "/map",         label: "Coverage Map",icon: MapPinned },
  { href: "/contractors", label: "Contractors", icon: Users },
  { href: "/alerts",      label: "Alerts",      icon: BellRing },
  { href: "/outreach",    label: "Outreach",    icon: Send },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 bg-[var(--color-ink)] text-white">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 grid place-items-center rounded-md bg-[var(--color-brand-500)] text-white font-black text-sm tracking-tight">
            DF&amp;I
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Subcontractor Coverage</div>
            <div className="text-[11px] text-white/60 tracking-wider uppercase">Built by The Solution Service</div>
          </div>
        </Link>
        <nav className="ml-4 hidden md:flex items-center gap-1">
          {ITEMS.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="px-3 py-1.5 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10 inline-flex items-center gap-2"
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <span className="px-2 py-1 rounded text-[10px] tracking-wider uppercase bg-amber-300/90 text-amber-950 font-bold">Demo</span>
          <span className="hidden lg:inline text-[11px] text-white/60">Sample data &middot; no real records</span>
        </div>
      </div>
    </header>
  );
}
