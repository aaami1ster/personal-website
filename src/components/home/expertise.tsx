import { Cloud, Landmark, Network, Server, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import type { ProjectCategory } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// Expertise section after the highlights strip (design spec §4.0, §4.6).
// Each card is one link to the projects gallery filtered by its category
// (`/projects?category=<key>`), so the whole card is clickable with no nested
// links. Hover changes the border colour; the 2px lift is motion-safe only
// (§2.6). A server component; only the next-intl Link hydrates. None of the
// icons is directional, so none flips in RTL (§2.5).

const cards = [
  { key: "banking", Icon: Landmark },
  { key: "architecture", Icon: Network },
  { key: "backend", Icon: Server },
  { key: "devops", Icon: Cloud },
] as const satisfies readonly { key: ProjectCategory; Icon: LucideIcon }[];

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
              <article className="h-full">
                <Link
                  href={{ pathname: "/projects", query: { category: key } }}
                  className="block h-full rounded-xl border bg-surface p-6 text-start transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5"
                >
                  <Icon aria-hidden="true" className="size-6 text-accent" />
                  <h3 className="mt-4 text-card font-semibold">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-muted">{t(`${key}.description`)}</p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
