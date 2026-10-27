import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

// About page (design spec §6.1). Static copy from docs/content/cv.md: the
// professional story, three engineering principles, education and spoken
// languages. No portrait (§14 #3) and no training list until its wording is
// confirmed in the CV.

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("About");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/about"),
  };
}

const paragraphs = ["p1", "p2", "p3", "p4", "p5"] as const;
const principles = ["right", "complexity", "reliability"] as const;
const languages = ["arabic", "english"] as const;

const card = "rounded-xl border bg-surface p-6";

// Isolates Latin terms (C++, Assembly) next to Arabic punctuation (§9.3).

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <Container className="max-w-[880px] py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <div className="max-w-[65ch] text-muted">
        {paragraphs.map((key) => (
          <p key={key} className="mt-6">
            {t(`story.${key}`)}
          </p>
        ))}
      </div>

      <section aria-labelledby="philosophy-heading" className="mt-16">
        <h2 id="philosophy-heading" className="text-card font-semibold">
          {t("philosophy.heading")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {principles.map((key) => (
            <li key={key} className={card}>
              <h3 className="font-semibold">{t(`philosophy.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted">
                {t(`philosophy.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-4">
        <section aria-labelledby="education-heading" className="sm:col-span-2">
          <h2 id="education-heading" className="text-card font-semibold">
            {t("education.heading")}
          </h2>
          <div className={`mt-6 ${card}`}>
            <p className="font-semibold">{t("education.university")}</p>
            <p className="mt-1 text-muted">{t("education.degree")}</p>
          </div>
        </section>

        <section aria-labelledby="languages-heading">
          <h2 id="languages-heading" className="text-card font-semibold">
            {t("languages.heading")}
          </h2>
          <ul className={`mt-6 grid gap-2 ${card}`}>
            {languages.map((key) => (
              <li key={key}>{t(`languages.${key}`)}</li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
