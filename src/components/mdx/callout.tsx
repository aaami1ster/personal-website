import type { ReactNode } from "react";
import { Info, Scale, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const calloutTypes = ["note", "warning", "decision"] as const;
export type CalloutType = (typeof calloutTypes)[number];

const variants = {
  note: { Icon: Info, border: "border-accent", text: "text-accent" },
  warning: { Icon: TriangleAlert, border: "border-danger", text: "text-danger" },
  decision: { Icon: Scale, border: "border-success", text: "text-success" },
} as const;

/**
 * `<Callout type="note|warning|decision">` (design spec §7). The label is in
 * the article's language, which can differ from the page's when an article
 * exists in one locale only; `locale` is bound by the MDX component map.
 */
export async function Callout({
  type,
  locale,
  children,
}: {
  type?: string;
  locale: Locale;
  children?: ReactNode;
}) {
  const kind: CalloutType = calloutTypes.includes(type as CalloutType)
    ? (type as CalloutType)
    : "note";
  const { Icon, border, text } = variants[kind];
  const t = await getTranslations({ locale, namespace: "Articles" });

  return (
    <aside
      className={cn(
        "my-8 rounded-e-lg border-s-4 bg-surface px-5 py-4",
        border,
      )}
    >
      <p
        className={cn(
          "m-0 flex items-center gap-2 font-sans text-sm font-semibold",
          text,
        )}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        {t(`callout.${kind}`)}
      </p>
      <div className="callout-body mt-2">{children}</div>
    </aside>
  );
}
