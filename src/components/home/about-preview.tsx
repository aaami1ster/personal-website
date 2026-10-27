import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

// About preview between the highlights strip and the expertise cards (design
// spec §4.0, §4.5). Static copy plus the §4.5 "More about me" link to /about,
// whose arrow flips in RTL (§9.2). The portrait is omitted (§14 #3). No
// motion, no client JS.
export async function AboutPreview() {
  const t = await getTranslations("Home.about");
  const tAbout = await getTranslations("About");

  return (
    <section aria-labelledby="about-heading" className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 id="about-heading" className="text-section font-bold">
            {t("heading")}
          </h2>
          <p className="mt-6 text-muted">{t("p1")}</p>
          <p className="mt-6 text-muted">{t("p2")}</p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 font-medium text-accent underline-offset-4 hover:underline"
          >
            {tAbout("more")}
            <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
