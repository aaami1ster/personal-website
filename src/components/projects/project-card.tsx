import { Fragment, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Project } from "@/data/projects";

// Gallery card (design spec §4.7 anatomy, without the thumbnail and the case
// study link, which come with later jobs): category badges, title, a muted
// "organization · role · period" line, a two-line summary and up to four
// stack tags. Fields that are unconfirmed (`null` / `has*: false`) are left
// out. Years are plain Western digits in both locales (§9.4). Technology
// names in Arabic copy are wrapped in <bdi> in the messages (§9.3).

const MAX_TAGS = 4;

const bdi = (chunks: ReactNode) => <bdi>{chunks}</bdi>;

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const key = `items.${project.slug}`;

  const period = project.period
    ? `${project.period.start}–${project.period.end ?? t("present")}`
    : null;
  const meta = [
    project.hasOrganization ? { text: t(`${key}.organization`) } : null,
    project.hasRole ? { text: t(`${key}.role`) } : null,
    // A year range never wraps at its dash.
    period ? { text: period, className: "whitespace-nowrap" } : null,
  ].filter((part) => part !== null);

  return (
    <article className="flex h-full flex-col rounded-xl border bg-surface p-6 text-start">
      <ul className="flex flex-wrap gap-2 text-xs font-medium">
        {project.categories.map((category) => (
          <li
            key={category}
            className="rounded-lg bg-accent/10 px-2 py-0.5 text-accent"
          >
            {t(`categories.${category}`)}
          </li>
        ))}
      </ul>
      <h2 className="mt-4 text-card font-semibold">
        {t.rich(`${key}.title`, { bdi })}
      </h2>
      {meta.length > 0 && (
        <p className="mt-2 text-sm text-muted">
          {/* Each part is isolated so Latin names ending in punctuation
              ("Musafer Inc.") keep their order on Arabic pages. */}
          {meta.map((part, i) => (
            <Fragment key={part.text}>
              {i > 0 && " · "}
              <bdi className={part.className}>{part.text}</bdi>
            </Fragment>
          ))}
        </p>
      )}
      <p className="mt-3 line-clamp-2 text-muted">
        {t.rich(`${key}.summary`, { bdi })}
      </p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
        {project.stack.slice(0, MAX_TAGS).map((tech) => (
          <li
            key={tech}
            dir="ltr"
            className="rounded-lg border px-2 py-0.5 font-mono text-xs text-fg/80"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
