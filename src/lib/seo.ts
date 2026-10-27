import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

/**
 * Indexable locale-independent paths, listed in the sitemap for every locale.
 * Each new page adds its path here (and later its slugs from the content loaders).
 */
export const indexablePaths = [
  "/",
  "/about",
  "/articles",
  "/contact",
  "/credits",
  "/experience",
  "/privacy",
  "/projects",
] as const;

/** Absolute site origin without a trailing slash, e.g. "https://example.com". */
export const siteOrigin = site.url.replace(/\/+$/, "");

/** Locale-prefixed URL for a path: ("en", "/") → "/en", ("ar", "/credits") → "/ar/credits". */
export function localePath(locale: Locale, path: string, origin = ""): string {
  const suffix = path === "/" ? "" : path;
  return `${origin}/${locale}${suffix}`;
}

/**
 * hreflang map for a path: one entry per locale plus `x-default` (the default
 * locale). Relative by default; pass `origin` for absolute URLs (sitemap).
 */
export function languageAlternates(
  path: string,
  origin = "",
): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localePath(l, path, origin)]),
  );
  languages["x-default"] = localePath(routing.defaultLocale, path, origin);
  return languages;
}

/**
 * hreflang map for a path that exists only in some locales (articles, §7):
 * one entry per existing locale, plus `x-default` only when the default
 * locale exists. Relative by default; pass `origin` for absolute URLs.
 */
export function existingLanguageAlternates(
  path: string,
  locales: readonly Locale[],
  origin = "",
): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales
      .filter((l) => locales.includes(l))
      .map((l) => [l, localePath(l, path, origin)]),
  );
  if (locales.includes(routing.defaultLocale)) {
    languages["x-default"] = localePath(routing.defaultLocale, path, origin);
  }
  return languages;
}

/** Canonical URL and hreflang alternates for a locale-independent path ("/", "/credits"). */
export function localeAlternates(
  locale: Locale,
  path: string,
): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: languageAlternates(path),
  };
}
