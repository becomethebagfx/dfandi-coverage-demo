import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "DF&I Subcontractor Coverage",
  description: "Interactive coverage and compliance dashboard demo by The Solution Service for Design Fabricators & Integrators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        <footer className="mx-auto max-w-7xl px-6 py-10 text-xs text-slate-500">
          <div className="border-t border-slate-200 pt-4">
            Demo built by The Solution Service for Design Fabricators &amp; Integrators. All contractor records shown are fictional sample data.
          </div>
        </footer>
      </body>
    </html>
  );
}
