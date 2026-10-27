import type { ReactNode } from "react";

/**
 * `<Diagram title caption>` (design spec §7): an original SVG diagram. The
 * drawing is wrapped in `dir="ltr"` so its internal flow is never mirrored on
 * Arabic pages (§9.2), and exposed to assistive technology as one image named
 * by `title`.
 */
export function Diagram({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <figure className="my-10">
      <div
        dir="ltr"
        role="img"
        aria-label={title}
        className="overflow-x-auto rounded-xl border bg-surface p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-sans text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
