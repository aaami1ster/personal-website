import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";

// About preview between the highlights strip and the expertise cards (design
// spec §4.0, §4.5). Static copy only: the §4.5 "More about me" link is added
// with the /about page, and the portrait is omitted (§14 #3). No motion, no
// client JS.
export async function AboutPreview() {
  const t = await getTranslations("Home.about");

  return (
    <section aria-labelledby="about-heading" className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 id="about-heading" className="text-section font-bold">
            {t("heading")}
          </h2>
          <p className="mt-6 text-muted">{t("p1")}</p>
          <p className="mt-6 text-muted">{t("p2")}</p>
        </div>
      </Container>
    </section>
  );
}
