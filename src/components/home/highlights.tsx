import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";

// Professional highlights strip below the hero (design spec §4.0, §4.3).
// Three static items only: no animation, no client JS. Each figure sits in an
// inline `dir="ltr"` span so "15+" never renders as "+15" on Arabic pages
// (§9.3), while the block keeps the page direction for alignment. Desktop
// dividers use logical borders, so they mirror correctly in RTL.

const items = ["years", "engineers", "stack"] as const;

export async function Highlights() {
  const t = await getTranslations("Home.highlights");

  return (
    <section
      aria-label={t("label")}
      className="border-y bg-surface/40 py-8 md:py-10"
    >
      <Container>
        <ul className="grid gap-6 md:grid-cols-3 md:gap-0">
          {items.map((key) => (
            <li
              key={key}
              className="text-start md:border-s md:px-6 md:text-center md:first:border-s-0"
            >
              <p className="text-section font-bold text-fg">
                <span dir="ltr">{t(`${key}.value`)}</span>
              </p>
              <p className="mt-1 text-sm font-medium text-muted">
                {t(`${key}.label`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
