import type { Locale } from "@/i18n/routing";

/** A calendar month, or a bare year when the source gives no month. */
export type YearMonth = { year: number; month?: number };

// Gregorian calendar and Western digits in both locales (design spec §9.4):
// plain "ar" would be fine today, but "ar-SA" defaults to the Umm al-Qura
// calendar, so the extensions are spelled out.
const intlLocale: Record<Locale, string> = {
  en: "en",
  ar: "ar-u-ca-gregory-nu-latn",
};

/** "Mar 2026" / "مارس 2026" for a month, "2019" for a bare year. */
export function formatYearMonth(value: YearMonth, locale: Locale): string {
  const date = new Date(Date.UTC(value.year, (value.month ?? 1) - 1, 1));
  return new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: "UTC",
    year: "numeric",
    ...(value.month ? { month: "short" } : {}),
  }).format(date);
}

/** Machine-readable value for `<time dateTime>`: "2026-03" or "2019". */
export function yearMonthDateTime(value: YearMonth): string {
  const year = String(value.year).padStart(4, "0");
  return value.month ? `${year}-${String(value.month).padStart(2, "0")}` : year;
}

/** "October 27, 2026" / "27 أكتوبر 2026" for an ISO calendar date ("2026-10-27"). */
export function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: "UTC",
    dateStyle: "long",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
