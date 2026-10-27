import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  getArticle,
  getArticleLocales,
  getArticleSlugs,
} from "@/lib/articles";
import {
  existingLanguageAlternates,
  indexablePaths,
  languageAlternates,
  localePath,
  siteOrigin,
} from "@/lib/seo";

// One entry per (path × locale), each with the same hreflang alternates the
// pages emit via localeAlternates(), as absolute URLs. Articles add one entry
// per published (non-draft) article per locale it actually exists in, with
// alternates limited to those locales (§7).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = indexablePaths.flatMap((path) => {
    const languages = languageAlternates(path, siteOrigin);
    return routing.locales.map((locale) => ({
      url: localePath(locale, path, siteOrigin),
      alternates: { languages },
    }));
  });

  const articles = getArticleSlugs().flatMap((slug) => {
    const path = `/articles/${slug}`;
    const locales = getArticleLocales(slug);
    const languages = existingLanguageAlternates(path, locales, siteOrigin);
    return locales.map((locale) => {
      const article = getArticle(slug, locale);
      return {
        url: localePath(locale, path, siteOrigin),
        lastModified: article?.updated ?? article?.published,
        alternates: { languages },
      };
    });
  });

  return [...pages, ...articles];
}
