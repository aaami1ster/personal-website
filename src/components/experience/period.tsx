import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { formatYearMonth, yearMonthDateTime, type YearMonth } from "@/lib/format";

/** A `<time>` for a month or bare year, formatted per locale (§9.4). */
export function YearMonthTime({ value, locale }: { value: YearMonth; locale: Locale }) {
  return (
    <time dateTime={yearMonthDateTime(value)}>{formatYearMonth(value, locale)}</time>
  );
}

/** "Mar 2026 – Present" / "مارس 2026 – حتى الآن", each date in a `<time>`. */
export async function Period({
  start,
  end,
  locale,
}: {
  start: YearMonth;
  end: YearMonth | "present";
  locale: Locale;
}) {
  const t = await getTranslations("Experience");

  return t.rich("period", {
    start: () => <YearMonthTime value={start} locale={locale} />,
    end: () =>
      end === "present" ? t("present") : <YearMonthTime value={end} locale={locale} />,
  });
}
