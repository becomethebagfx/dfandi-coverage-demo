import { CONTRACTORS } from "@/lib/data";
import { UploadComposer } from "@/components/UploadComposer";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata = { title: "Upload - DF&I Subcontractor Coverage" };

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-10 pb-16">
      <header className="border-b border-[var(--color-ink)]/10 pb-6">
        <SectionLabel>Intake</SectionLabel>
        <h1 className="font-display mt-2 text-[30px] sm:text-[40px] leading-tight tracking-tight">
          Add a document to a contractor.
        </h1>
        <p className="mt-3 max-w-2xl text-[14px] text-[var(--color-ink)]/65 leading-relaxed">
          Drop a Certificate of Insurance, license, OSHA card or W9. Smart Intake reads the file, classifies it,
          and finds the contractor for you. Manual entry is always available if you prefer.
        </p>
      </header>
      <div className="mt-8">
        <UploadComposer contractors={CONTRACTORS} />
      </div>
    </div>
  );
}
