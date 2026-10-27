import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BidiText } from "@/components/experience/bidi-text";
import { Period, YearMonthTime } from "@/components/experience/period";
import { TagList } from "@/components/experience/tag-list";
import { Container } from "@/components/layout/container";
import { education, roles, training, type Localized } from "@/data/experience";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/experience">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Experience");
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/experience"),
  };
}

// Career timeline (design spec §6.2). All career text comes from
// src/data/experience.ts; this file only adds layout and UI labels.
//
// Layout: one column on mobile with the rail at the inline-start edge; from
// `md` a two-column grid per role, with the period and location on the
// inline-start side of the rail and the content on the inline-end side. The
// rail (a pseudo-element on the <ol>) and the dots use logical insets only,
// so in Arabic the rail sits on the right. In each <article> the h2 comes
// first in source order and the date column is placed with grid positions.
export default async function ExperiencePage({
  params,
}: PageProps<"/[locale]/experience">) {
  const { locale: param } = await params;
  const locale = param as Locale;
  const t = await getTranslations("Experience");
  const text = (value: Localized) => <BidiText text={value[locale]} locale={locale} />;

  return (
    <Container className="max-w-[960px] py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-[65ch] text-muted">{t("intro")}</p>

      <ol
        aria-label={t("timelineLabel")}
        className="relative mt-14 before:absolute before:inset-y-2 before:start-[5px] before:w-px before:bg-border md:before:start-[13rem]"
      >
        {roles.map((role) => (
          <li key={role.id} className="pb-14 ps-8 last:pb-0 md:ps-0">
            <article className="md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:grid-rows-[auto_1fr]">
              <header className="md:col-start-2 md:row-start-1 md:ps-10">
                <h2 className="relative text-card font-semibold">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -start-8 top-[calc(0.5lh-5.5px)] size-[11px] rounded-full border-2 border-accent md:start-[calc(-2.5rem-5px)]",
                      role.end === "present" ? "bg-accent" : "bg-bg",
                    )}
                  />
                  {text(role.title)}
                </h2>
                <p className="mt-1 flex flex-wrap gap-x-2 font-medium text-accent">
                  <bdi>{role.organization[locale]}</bdi>
                  {role.sector && (
                    <>
                      <span aria-hidden="true" className="text-muted">·</span>
                      <span className="text-muted">{role.sector[locale]}</span>
                    </>
                  )}
                </p>
              </header>

              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0 md:flex-col md:pt-1.5 md:pe-8 md:text-end">
                <span className="font-medium text-fg">
                  <Period start={role.start} end={role.end} locale={locale} />
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted md:justify-end">
                  <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                  {role.location[locale]}
                </span>
              </p>

              <div className="md:col-start-2 md:row-start-2 md:ps-10">
                <ul className="mt-5 list-disc space-y-2 ps-5 marker:text-accent">
                  {role.highlights.map((highlight) => (
                    <li key={highlight.en}>{text(highlight)}</li>
                  ))}
                </ul>
                <div className="mt-5">
                  <TagList tags={role.tags} label={t("technologies")} />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <section aria-labelledby="education-heading" className="mt-20">
        <h2 id="education-heading" className="text-section font-bold">
          {t("education")}
        </h2>
        <ul className="mt-6 space-y-4">
          {education.map((item) => (
            <li key={item.id} className="rounded-xl border bg-surface p-6">
              <h3 className="text-card font-semibold">{text(item.degree)}</h3>
              <p className="mt-1 font-medium text-accent">{item.institution[locale]}</p>
              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <YearMonthTime value={item.year} locale={locale} />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                  {item.location[locale]}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="training-heading" className="mt-20">
        <h2 id="training-heading" className="text-section font-bold">
          {t("training")}
        </h2>
        <p className="mt-4 max-w-[65ch] text-muted">{t("trainingNote")}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {training.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 rounded-xl border bg-surface p-5">
              {item.kind === "training" && (
                <span className="self-start rounded-lg border px-2 py-0.5 text-xs font-medium text-accent">
                  {t("trainingBadge")}
                </span>
              )}
              <p className="font-medium">
                <bdi>{item.title[locale]}</bdi>
              </p>
              {item.detail && <p className="text-sm text-muted">{text(item.detail)}</p>}
              <p className="mt-auto flex flex-wrap gap-x-3 text-sm text-muted">
                <bdi>{item.provider[locale]}</bdi>
                {item.date && <YearMonthTime value={item.date} locale={locale} />}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
