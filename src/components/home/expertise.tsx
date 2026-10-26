import { Cloud, Landmark, Network, Server, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";

// Expertise section after the highlights strip (design spec §4.0, §4.6).
// Four static, non-interactive cards: the §4.6 links to filtered projects are
// added once the /projects gallery exists. No motion, no client JS. None of
// the icons is directional, so none flips in RTL (§2.5).

const cards = [
  { key: "banking", Icon: Landmark },
  { key: "architecture", Icon: Network },
  { key: "backend", Icon: Server },
  { key: "devops", Icon: Cloud },
] as const satisfies readonly { key: string; Icon: LucideIcon }[];

export async function Expertise() {
  const t = await getTranslations("Home.expertise");

  return (
    <section aria-labelledby="expertise-heading" className="py-16 md:py-24">
      <Container>
        <h2 id="expertise-heading" className="text-section font-bold">
          {t("heading")}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ key, Icon }) => (
            <li key={key}>
              <article className="h-full rounded-xl border bg-surface p-6 text-start">
                <Icon aria-hidden="true" className="size-6 text-accent" />
                <h3 className="mt-4 text-card font-semibold">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 text-muted">{t(`${key}.description`)}</p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
