import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { localeDirection, routing } from "@/i18n/routing";
import { fontVariables, interFaceOnly } from "@/lib/fonts";
import { site } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={fontVariables}
      style={{ "--font-inter-face": interFaceOnly } as CSSProperties}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        {/* Client components receive their strings as props, so no message
            catalog is serialized to the browser. */}
        <NextIntlClientProvider messages={null}>
          <ThemeProvider>
            <SkipLink />
            <Navbar />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
