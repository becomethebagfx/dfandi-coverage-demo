import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const display = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DF&I Subcontractor Coverage",
  description: "Subcontractor coverage and compliance app for Design Fabricators & Integrators. Built by The Solution Service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="bg-grain min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="mx-auto w-full max-w-7xl px-5 sm:px-8 py-10 mt-16 text-[11px] text-[var(--color-ink)]/60 leading-relaxed">
            <div className="border-t border-[var(--color-ink)]/10 pt-5 flex flex-wrap items-center justify-between gap-2">
              <div className="font-sans tracking-wide">
                Built by The Solution Service for Design Fabricators &amp; Integrators.
              </div>
              <div className="font-mono uppercase tracking-[0.18em]">Sample data &middot; no real records</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
