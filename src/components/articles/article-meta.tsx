import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * "October 27, 2026 · 6 min read" for a card, or "Published …· Updated … ·
 * 6 min read" (`detailed`) for an article header. Dates use the Gregorian
 * calendar and Western digits in both locales (§9.4).
 */
export async function ArticleMeta({
  article,
  locale,
  detailed = false,
  className,
}: {
  article: Article;
  locale: Locale;
  detailed?: boolean;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "Articles" });
  // `dateTime` carries the machine-readable date; the visible text may
  // include the "Published" / "Updated" label around it.
  const time = (iso: string, text: string) => (
    <time dateTime={iso}>{text}</time>
  );
  const date = (iso: string) => formatDate(iso, locale);
  const updated =
    detailed && article.updated && article.updated !== article.published
      ? article.updated
      : null;

  const parts = [
    {
      id: "published",
      node: time(
        article.published,
        detailed
          ? t("published", { date: date(article.published) })
          : date(article.published),
      ),
    },
    updated
      ? { id: "updated", node: time(updated, t("updated", { date: date(updated) })) }
      : null,
    {
      id: "reading",
      node: t("readingTime", { minutes: article.readingTime }),
    },
  ].filter((part) => part !== null);

  return (
    <p className={cn("flex flex-wrap gap-x-2 text-sm text-muted", className)}>
      {parts.map((part, i) => (
        <span key={part.id} className="whitespace-nowrap">
          {i > 0 && <span aria-hidden="true">· </span>}
          {part.node}
        </span>
      ))}
    </p>
  );
}
