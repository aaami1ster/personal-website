import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

// Privacy notice (design spec §3, §10.2). The copy describes the site as it is
// built: the contact form emails without storing anything, there is no
// analytics, and the only browser storage is next-intl's NEXT_LOCALE cookie
// and next-themes' `theme` localStorage entry. Update LAST_UPDATED whenever
// the copy changes.
const LAST_UPDATED = "2026-10-27";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Privacy");
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/privacy"),
  };
}

const sections = [
  { heading: "formHeading", paragraphs: ["formBody", "formFallback"] },
  { heading: "abuseHeading", paragraphs: ["abuseBody"] },
  { heading: "retentionHeading", paragraphs: ["retentionBody"] },
  { heading: "storageHeading", paragraphs: ["storageBody"] },
  { heading: "analyticsHeading", paragraphs: ["analyticsBody", "hostingLogs"] },
] as const;

const link = "text-accent underline-offset-4 hover:underline";
const body = "mt-4 max-w-[65ch] text-muted";

// Technical names are isolated as LTR inside Arabic sentences (§9.3).
const code = (chunks: ReactNode) => (
  <code dir="ltr" className="font-mono text-[0.9em] text-fg">
    {chunks}
  </code>
);

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  const t = await getTranslations("Privacy");

  return (
    <Container className="max-w-[880px] py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <p className="mt-4 text-sm text-muted">
        {t.rich("updated", {
          date: formatDate(LAST_UPDATED, locale as Locale),
          time: (chunks) => <time dateTime={LAST_UPDATED}>{chunks}</time>,
        })}
      </p>
      <p className="mt-6 max-w-[65ch] text-muted">{t("intro")}</p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="text-card font-semibold">{t(section.heading)}</h2>
          {section.paragraphs.map((key) => (
            <p key={key} className={body}>
              {t.rich(key, { code })}
            </p>
          ))}
        </section>
      ))}

      <section className="mt-12">
        <h2 className="text-card font-semibold">{t("rightsHeading")}</h2>
        <p className={body}>
          {t.rich("rightsBody", {
            email: site.email,
            link: (chunks) => (
              <a href={`mailto:${site.email}`} className={link} dir="ltr">
                {chunks}
              </a>
            ),
          })}
        </p>
      </section>

      <p className="mt-12 text-sm text-muted">{t("changes")}</p>
    </Container>
  );
}
