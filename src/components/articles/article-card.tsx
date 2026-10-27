import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import type { Article } from "@/lib/articles";
import { ArticleMeta } from "./article-meta";

/**
 * Index card (design spec §4.9 anatomy): category, title, excerpt, date and
 * reading time. An article that exists only in the other locale keeps its
 * original title and excerpt, marked with `lang`/`dir`, plus an "English
 * only" / "Arabic only" badge; it is never machine-translated (§7).
 */
export async function ArticleCard({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const t = await getTranslations("Articles");
  const foreign = article.locale !== locale;
  const original = foreign
    ? { lang: article.locale, dir: localeDirection[article.locale] }
    : {};

  return (
    <article className="relative rounded-xl border bg-surface p-6 text-start transition-colors hover:border-accent/60">
      <ul className="flex flex-wrap gap-2 text-xs font-medium">
        <li className="rounded-lg bg-accent/10 px-2 py-0.5 text-accent">
          {t(`categories.${article.category}`)}
        </li>
        {foreign && (
          <li className="rounded-lg border px-2 py-0.5 text-muted">
            {t(`onlyIn.${article.locale}`)}
          </li>
        )}
      </ul>
      <h2 className="mt-4 text-card font-semibold">
        {/* The link covers the whole card; nothing else in it is interactive. */}
        <Link
          href={`/articles/${article.slug}`}
          className="after:absolute after:inset-0 after:rounded-xl hover:text-accent"
        >
          <span {...original}>{article.title}</span>
        </Link>
      </h2>
      <p className="mt-3 text-muted" {...original}>
        {article.description}
      </p>
      <ArticleMeta article={article} locale={locale} className="mt-4" />
    </article>
  );
}
