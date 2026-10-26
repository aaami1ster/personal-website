import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { site } from "@/lib/site";

// Final CTA closing the homepage (design spec §4.0, §4.10). Copy on the
// inline-start side and the button on the inline-end side from `md`, stacked
// on mobile. The button is a mailto link until /contact exists (Phase 4, §12);
// that job swaps it for `Link href="/contact"`. The arrow flips in RTL (§2.5).
export async function FinalCta() {
  const t = await getTranslations("Home.cta");

  return (
    <section aria-labelledby="cta-heading" className="border-t py-16 md:py-24">
      <Container className="md:flex md:items-center md:justify-between md:gap-12">
        <div>
          <h2 id="cta-heading" className="text-section font-bold">
            {t("heading")}
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted">{t("body")}</p>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-cta px-5 font-medium text-white transition-colors hover:bg-cta-hover md:mt-0 md:w-auto"
        >
          {t("button")}
          <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </a>
      </Container>
    </section>
  );
}
