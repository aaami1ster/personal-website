import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

// The locale comes from the `[locale]` root segment rather than request
// headers, so every page can still be prerendered with Cache Components. An
// explicit locale (`getTranslations({ locale })`) wins: an article that exists
// in one locale only renders its own chrome in its language on the other
// locale's page.
export default getRequestConfig(async ({ locale: explicit }) => {
  const requested = explicit ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    timeZone: "Asia/Riyadh",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
