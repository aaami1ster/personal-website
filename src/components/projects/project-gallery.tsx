"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectFilters, type FilterValue } from "./project-filters";
import { isProjectCategory, type ProjectCategory } from "@/data/projects";

export type GalleryItem = {
  slug: string;
  categories: ProjectCategory[];
  /** The server-rendered card. */
  card: ReactNode;
};

export type GalleryLabels = {
  filterLabel: string;
  all: string;
  emptyCategory: string;
  categories: Record<ProjectCategory, string>;
  /** Pre-formatted `Projects.count` for each filter. */
  counts: Record<FilterValue, string>;
};

type GalleryProps = { items: GalleryItem[]; labels: GalleryLabels };

/**
 * Filters and card grid for a given active filter. Hook-free, so the page can
 * render it as the Suspense fallback with "all" active: the static HTML (and
 * visitors without JavaScript) get every visible card.
 */
export function ProjectGalleryView({
  items,
  labels,
  active,
}: GalleryProps & { active: FilterValue }) {
  const shown =
    active === "all"
      ? items
      : items.filter((item) => item.categories.includes(active));

  return (
    <>
      <ProjectFilters labels={labels} active={active} />
      <p aria-live="polite" className="sr-only">
        {labels.counts[active]}
      </p>
      {shown.length > 0 ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <li key={item.slug}>{item.card}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-muted">{labels.emptyCategory}</p>
      )}
    </>
  );
}

/**
 * Reads `?category=` on the client so the page itself never touches
 * `searchParams` and stays prerendered. Unknown or missing values mean "all".
 */
export function ProjectGallery(props: GalleryProps) {
  const category = useSearchParams().get("category");
  const active = isProjectCategory(category) ? category : "all";
  return <ProjectGalleryView {...props} active={active} />;
}
