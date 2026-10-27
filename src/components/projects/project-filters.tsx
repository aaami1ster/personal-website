import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { projectCategories, type ProjectCategory } from "@/data/projects";

export type FilterValue = "all" | ProjectCategory;

const filters: readonly FilterValue[] = ["all", ...projectCategories];

const linkClass = cn(
  "inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium text-muted transition-colors",
  "hover:border-accent hover:text-fg",
  "aria-[current=true]:border-accent aria-[current=true]:bg-accent/10 aria-[current=true]:text-fg",
);

// Category filters for /projects. Each is a real link to `?category=<key>`
// (plain /projects for "All"), so filtering works by URL, can be shared, and
// keeps the scroll position. The active filter carries aria-current="true".
export function ProjectFilters({
  labels,
  active,
}: {
  labels: { filterLabel: string; all: string; categories: Record<ProjectCategory, string> };
  active: FilterValue;
}) {
  return (
    <nav aria-label={labels.filterLabel} className="mt-10">
      <ul className="flex flex-wrap gap-2">
        {filters.map((value) => (
          <li key={value}>
            <Link
              href={
                value === "all"
                  ? "/projects"
                  : { pathname: "/projects", query: { category: value } }
              }
              scroll={false}
              aria-current={value === active ? "true" : undefined}
              className={linkClass}
            >
              {value === "all" ? labels.all : labels.categories[value]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
