import { articles as allArticles, type Article } from "#site/content";
import { routing, type Locale } from "@/i18n/routing";

// Loader for the Velite `articles` collection (design spec §7). Velite runs
// before `next typegen` and `next build`, so this reads the generated JSON at
// build time; the compiled MDX bodies are evaluated only in Server Components
// during prerender.

export type { Article };

/** Newest first; ties broken by slug so the order is stable. */
const byNewest = (a: Article, b: Article) =>
  b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug);

// Drafts show up in `next dev` and are excluded from production builds.
const showDrafts = process.env.NODE_ENV === "development";

const published: Article[] = allArticles
  .filter((a) => showDrafts || !a.draft)
  .sort(byNewest);

/**
 * One entry per slug for a locale, newest first: the locale's own version when
 * it exists, otherwise the other locale's version (shown with an "English
 * only" / "Arabic only" badge, never machine-translated).
 */
export function getArticles(locale: Locale): Article[] {
  const bySlug = new Map<string, Article>();
  for (const article of published) {
    const current = bySlug.get(article.slug);
    if (!current || (current.locale !== locale && article.locale === locale)) {
      bySlug.set(article.slug, article);
    }
  }
  return [...bySlug.values()].sort(byNewest);
}

/** The article in exactly this locale, if it exists and is published. */
export function getArticle(slug: string, locale: Locale): Article | undefined {
  return published.find((a) => a.slug === slug && a.locale === locale);
}

/** Locales the slug is published in, in routing order. */
export function getArticleLocales(slug: string): Locale[] {
  return routing.locales.filter((l) => getArticle(slug, l) !== undefined);
}

/** Every published slug, in any locale. */
export function getArticleSlugs(): string[] {
  return [...new Set(published.map((a) => a.slug))];
}
