import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

/** Canonical URL and hreflang alternates for a locale-independent path ("/", "/credits"). */
export function localeAlternates(
  locale: Locale,
  path: string,
): Metadata["alternates"] {
  const suffix = path === "/" ? "" : path;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${suffix}`]),
  );
  languages["x-default"] = `/${routing.defaultLocale}${suffix}`;

  return { canonical: `/${locale}${suffix}`, languages };
}
