import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Monogram } from "@/components/brand/monogram";
import { fontVariables, interFaceOnly } from "@/lib/fonts";
import ar from "../../messages/ar.json";
import en from "../../messages/en.json";
import "./globals.css";

export const metadata: Metadata = {
  title: `${en.NotFound.title} | ${en.Brand.name}`,
};

// This page bypasses the [locale] layout, so it has no ThemeProvider. Apply a
// stored manual theme choice; otherwise the CSS follows the system preference.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const sections = [
  { locale: "en", dir: "ltr", Heading: "h1", t: en.NotFound },
  { locale: "ar", dir: "rtl", Heading: "h2", t: ar.NotFound },
] as const;

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      dir="ltr"
      className={fontVariables}
      style={{ "--font-inter-face": interFaceOnly } as CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
        <main className="w-full max-w-[40rem]">
          <Link href="/" aria-label={en.Brand.homeLabel} className="inline-block text-fg">
            <Monogram className="h-7" />
          </Link>
          <p className="mt-10 font-mono text-sm text-accent">404</p>
          <div className="mt-4 grid gap-10 sm:grid-cols-2">
            {sections.map(({ locale, dir, Heading, t }) => (
              <section key={locale} lang={locale} dir={dir}>
                <Heading className="text-section font-bold">{t.title}</Heading>
                <p className="mt-3 text-muted">{t.body}</p>
                <Link
                  href={`/${locale}`}
                  className="mt-6 inline-flex h-11 items-center rounded-lg bg-cta px-5 font-medium text-white transition-colors hover:bg-cta-hover"
                >
                  {t.home}
                </Link>
              </section>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
