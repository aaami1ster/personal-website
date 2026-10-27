import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/projects/project-card";
import {
  ProjectGallery,
  ProjectGalleryView,
  type GalleryItem,
  type GalleryLabels,
} from "@/components/projects/project-gallery";
import { getProjects, projectCategories } from "@/data/projects";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Projects");
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/projects"),
  };
}

// Portfolio gallery (design spec §3). The page never reads `searchParams`, so
// both locales stay prerendered: the client gallery reads `?category=` itself,
// and its Suspense fallback is the unfiltered grid. Every card is public;
// `publishApproved` gates only the future case-study pages (§5), so cards do
// not link anywhere yet.
export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  const projects = getProjects();

  const items: GalleryItem[] = projects.map((project) => ({
    slug: project.slug,
    categories: project.categories,
    card: <ProjectCard project={project} />,
  }));

  const countFor = (n: number) => t("count", { count: n });
  const labels: GalleryLabels = {
    filterLabel: t("filterLabel"),
    all: t("all"),
    emptyCategory: t("emptyCategory"),
    categories: Object.fromEntries(
      projectCategories.map((c) => [c, t(`categories.${c}`)]),
    ) as GalleryLabels["categories"],
    counts: {
      all: countFor(projects.length),
      ...(Object.fromEntries(
        projectCategories.map((c) => [
          c,
          countFor(projects.filter((p) => p.categories.includes(c)).length),
        ]),
      ) as Omit<GalleryLabels["counts"], "all">),
    },
  };

  return (
    <Container className="py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-[65ch] text-muted">{t("intro")}</p>
      <Suspense
        fallback={<ProjectGalleryView items={items} labels={labels} active="all" />}
      >
        <ProjectGallery items={items} labels={labels} />
      </Suspense>
    </Container>
  );
}
