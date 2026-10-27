import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  indexablePaths,
  languageAlternates,
  localePath,
  siteOrigin,
} from "@/lib/seo";

// One entry per (path × locale), each with the same hreflang alternates the
// pages emit via localeAlternates(), as absolute URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePaths.flatMap((path) => {
    const languages = languageAlternates(path, siteOrigin);
    return routing.locales.map((locale) => ({
      url: localePath(locale, path, siteOrigin),
      alternates: { languages },
    }));
  });
}
