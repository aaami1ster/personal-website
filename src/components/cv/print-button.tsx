"use client";

import { Printer } from "lucide-react";

/**
 * Opens the browser's print dialog, where visitors can also save the CV as a
 * PDF. The label comes from the server page because the layout serializes no
 * message catalog to the browser.
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 font-medium text-white transition-colors hover:bg-cta-hover"
    >
      <Printer aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </button>
  );
}
