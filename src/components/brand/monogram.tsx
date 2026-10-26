import { cn } from "@/lib/utils";

// "AM." drawn as strokes so it never depends on a font being loaded.
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-auto shrink-0", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M2.5 22 9.5 2.5 16.5 22" />
        <path d="M5.6 14.5h7.8" />
        <path d="M21 22V2.5l7 11.5 7-11.5V22" />
      </g>
      <circle cx="41" cy="20.4" r="2.4" fill="var(--accent)" />
    </svg>
  );
}
