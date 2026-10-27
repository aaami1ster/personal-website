import { Fragment, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Project } from "@/data/projects";

// Gallery card (design spec §4.7 anatomy, without the thumbnail and the case
// study link, which come with later jobs): category badges, title, a muted
// "organization · role · period" line, the full summary and up to four stack
// tags. The summary is deliberately not clamped to §4.7's two lines until case
// studies exist to hold the rest. Fields that are unconfirmed (`null` /
// `has*: false`) are left out. Years are plain Western digits in both locales
// (§9.4). Technology names in Arabic copy are wrapped in <bdi> in the messages
// and the stack tags always run left to right (§9.3).

const MAX_TAGS = 4;

const bdi = (chunks: ReactNode) => <bdi>{chunks}</bdi>;

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const key = `items.${project.slug}`;

  const period = project.period
    ? `${project.period.start}–${project.period.end ?? t("present")}`
    : null;
  // Fixed field ids give the parts stable React keys.
  const meta = [
    project.hasOrganization
      ? { id: "organization" as const, text: t(`${key}.organization`) }
      : null,
    project.hasRole ? { id: "role" as const, text: t(`${key}.role`) } : null,
    period ? { id: "period" as const, text: period } : null,
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
              ("Musafer Inc.") keep their order on Arabic pages, and never
              wraps inside itself. The "·" is glued to the part after it, so a
              line can only break before a separator, never after one. */}
          {meta.map((part, i) => {
            const text = <bdi className="whitespace-nowrap">{part.text}</bdi>;
            return i === 0 ? (
              <Fragment key={part.id}>{text}</Fragment>
            ) : (
              <Fragment key={part.id}>
                {" "}
                <span className="whitespace-nowrap">· {text}</span>
              </Fragment>
            );
          })}
        </p>
      )}
      <p className="mt-3 text-muted">{t.rich(`${key}.summary`, { bdi })}</p>
      <ul dir="ltr" className="mt-auto flex flex-wrap gap-2 pt-5">
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
