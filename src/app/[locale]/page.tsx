import type { Metadata } from "next";
import { MapPin, Landmark } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AboutPreview } from "@/components/home/about-preview";
import { Expertise } from "@/components/home/expertise";
import { FinalCta } from "@/components/home/final-cta";
import { HeroDiagram } from "@/components/home/hero-diagram";
import { Highlights } from "@/components/home/highlights";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localeAlternates(locale as Locale, "/") };
}

// Hero: intro copy on the inline-start side, architecture diagram on the
// inline-end side from `lg` (stacked below), followed by the professional
// highlights strip, the About preview, the expertise cards and the final CTA.
// Hero CTAs, the terminal entry bar and the remaining homepage sections are
// added in later jobs.
export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <>
      <Container className="grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-accent [:lang(ar)_&]:normal-case [:lang(ar)_&]:tracking-normal">
            {t("eyebrow")}
          </p>
          <h1 className="mt-6 max-w-[18ch] text-hero font-bold">
            {t("greeting")}
            <br />
            <span className="text-accent">{t("role")}</span>
          </h1>
          <p className="mt-6 max-w-[34ch] text-section leading-snug font-semibold text-fg/90">
            {t("tagline")}
          </p>
          <p className="mt-6 max-w-[62ch] text-muted">{t("intro")}</p>
          <ul className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
            <li className="inline-flex items-center gap-2 rounded-lg border bg-surface px-3 py-1.5">
              <MapPin aria-hidden="true" className="size-4 text-accent" />
              {t("location")}
            </li>
            <li className="inline-flex items-center gap-2 rounded-lg border bg-surface px-3 py-1.5">
              <Landmark aria-hidden="true" className="size-4 text-accent" />
              {t("domain")}
            </li>
          </ul>
        </div>
        <HeroDiagram className="lg:col-span-5" />
      </Container>
      <Highlights />
      <AboutPreview />
      <Expertise />
      <FinalCta />
    </>
  );
}
