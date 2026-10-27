import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/cv/print-button";
import { BidiText } from "@/components/experience/bidi-text";
import { Period, YearMonthTime } from "@/components/experience/period";
import { Container } from "@/components/layout/container";
import { education, roles, training, type Localized } from "@/data/experience";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { cvPdf, site } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cv">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Cv");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/cv"),
  };
}

// Printable CV. Every fact comes from src/data/experience.ts, src/lib/site.ts
// or messages/*.json, so the CV always matches the rest of the site. Contact
// details are limited to city, email and profile links (design spec §10.1).
//
// Source order is print order. The toolbar is `print:hidden`; the print rules
// in globals.css (A4 page, ink on white, no breaks inside an <article>) hide
// the navbar, skip link and footer.

const expertise = ["banking", "architecture", "backend", "devops"] as const;
const languages = ["arabic", "english"] as const;

/** "https://www.linkedin.com/in/x/" → "linkedin.com/in/x", readable on paper. */
const displayUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");

const sectionClass = "mt-12 print:mt-6";
const headingClass =
  "border-b pb-2 text-xl font-bold print:pb-1 print:text-[13pt]";
const linkClass = "text-accent underline-offset-4 hover:underline";

export default async function CvPage({ params }: PageProps<"/[locale]/cv">) {
  const { locale: param } = await params;
  const locale = param as Locale;
  const t = await getTranslations();
  const text = (value: Localized) => <BidiText text={value[locale]} locale={locale} />;
  const pdf = cvPdf[locale];

  const contacts = [
    { key: "github", href: site.github },
    { key: "linkedin", href: site.linkedin },
  ] as const;

  return (
    <Container className="max-w-[860px] py-16 md:py-20 print:py-0">
      <header>
        <h1 className="text-page font-bold">{t("Brand.name")}</h1>
        <p className="mt-2 text-lg font-medium text-accent print:text-[12pt]">
          {t("Cv.role")}
        </p>
        <ul
          aria-label={t("Cv.contactLabel")}
          className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted"
        >
          <li>{t("Home.location")}</li>
          <li>
            <a href={`mailto:${site.email}`} dir="ltr" className={linkClass}>
              {site.email}
            </a>
          </li>
          {contacts.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                rel="me noopener"
                dir="ltr"
                className={`${linkClass} break-all`}
              >
                {displayUrl(href)}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-surface p-4 print:hidden">
        <PrintButton label={t("Cv.print")} />
        {pdf && (
          <a
            href={pdf.href}
            download
            className="inline-flex h-11 items-center gap-2 rounded-lg border px-5 font-medium transition-colors hover:border-accent"
          >
            <Download aria-hidden="true" className="size-4 shrink-0" />
            {t("Cv.downloadPdf", { size: String(pdf.sizeKb) })}
          </a>
        )}
        <p className="text-sm text-muted">{t("Cv.printHint")}</p>
      </div>

      <section aria-labelledby="cv-summary" className={sectionClass}>
        <h2 id="cv-summary" className={headingClass}>
          {t("Cv.summary")}
        </h2>
        <p className="mt-4 print:mt-2">{t("Home.intro")}</p>
      </section>

      <section aria-labelledby="cv-expertise" className={sectionClass}>
        <h2 id="cv-expertise" className={headingClass}>
          {t("Home.expertise.heading")}
        </h2>
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 print:mt-2 print:grid-cols-2 print:gap-y-2">
          {expertise.map((key) => (
            <li key={key}>
              <h3 className="font-semibold">{t(`Home.expertise.${key}.title`)}</h3>
              <p className="text-sm text-muted">
                {t(`Home.expertise.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cv-experience" className={sectionClass}>
        <h2 id="cv-experience" className={headingClass}>
          {t("Experience.title")}
        </h2>
        <ol className="mt-6 space-y-8 print:mt-3 print:space-y-4">
          {roles.map((role) => (
            <li key={role.id}>
              <article>
                <header>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-lg font-semibold print:text-[11.5pt]">
                      {text(role.title)}
                    </h3>
                    <p className="text-sm font-medium">
                      <Period start={role.start} end={role.end} locale={locale} />
                    </p>
                  </div>
                  <p className="mt-0.5 flex flex-wrap gap-x-2 text-sm">
                    <bdi className="font-medium text-accent">{role.organization[locale]}</bdi>
                    {role.sector && (
                      <>
                        <span aria-hidden="true" className="text-muted">·</span>
                        <span className="text-muted">{role.sector[locale]}</span>
                      </>
                    )}
                    <span aria-hidden="true" className="text-muted">·</span>
                    <span className="text-muted">{role.location[locale]}</span>
                  </p>
                </header>
                <ul className="mt-3 list-disc space-y-1.5 ps-5 marker:text-accent print:mt-2 print:space-y-1">
                  {role.highlights.map((highlight) => (
                    <li key={highlight.en}>{text(highlight)}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-medium text-fg">{t("Experience.technologies")}:</span>{" "}
                  <bdi dir="ltr">{role.tags.join(", ")}</bdi>
                </p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cv-education" className={sectionClass}>
        <h2 id="cv-education" className={headingClass}>
          {t("Experience.education")}
        </h2>
        <ul className="mt-4 space-y-4 print:mt-2">
          {education.map((item) => (
            <li key={item.id}>
              <article>
                <h3 className="font-semibold">{text(item.degree)}</h3>
                <p className="mt-0.5 flex flex-wrap gap-x-2 text-sm text-muted">
                  <span className="font-medium text-accent">{item.institution[locale]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.location[locale]}</span>
                  <span aria-hidden="true">·</span>
                  <YearMonthTime value={item.year} locale={locale} />
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cv-training" className={sectionClass}>
        <h2 id="cv-training" className={headingClass}>
          {t("Experience.training")}
        </h2>
        <ul className="mt-4 space-y-3 print:mt-2 print:space-y-2">
          {training.map((item) => (
            <li key={item.id}>
              <article>
                <h3 className="flex flex-wrap items-baseline gap-x-2 font-semibold">
                  <bdi>{item.title[locale]}</bdi>
                  {item.kind === "training" && (
                    <span className="rounded-md border px-1.5 text-xs font-medium text-accent">
                      {t("Experience.trainingBadge")}
                    </span>
                  )}
                </h3>
                {item.detail && <p className="text-sm text-muted">{text(item.detail)}</p>}
                <p className="flex flex-wrap gap-x-2 text-sm text-muted">
                  <bdi>{item.provider[locale]}</bdi>
                  {item.date && (
                    <>
                      <span aria-hidden="true">·</span>
                      <YearMonthTime value={item.date} locale={locale} />
                    </>
                  )}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cv-languages" className={sectionClass}>
        <h2 id="cv-languages" className={headingClass}>
          {t("About.languages.heading")}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 print:mt-2">
          {languages.map((key) => (
            <li key={key}>{t(`About.languages.${key}`)}</li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
