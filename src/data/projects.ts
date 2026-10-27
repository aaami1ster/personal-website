// Project facts for the /projects gallery (design spec §3, §4.7, §5), taken
// from docs/content/projects.md and cv.md. Localized text (title,
// organization, role, summary) lives in messages/*.json under
// `Projects.items.<slug>`; this file holds only language-neutral facts.
// Unconfirmed facts are `null` (or `hasOrganization`/`hasRole: false`) and the
// card leaves them out. No metrics, volumes or outcomes.
//
// `publishApproved` stays false until Abdalla approves the project (§5).
// Unapproved projects render only in `next dev`, never in production builds.

export const projectCategories = [
  "banking",
  "architecture",
  "backend",
  "devops",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export function isProjectCategory(v: unknown): v is ProjectCategory {
  return (
    typeof v === "string" &&
    (projectCategories as readonly string[]).includes(v)
  );
}

export type Project = {
  /** Stable English slug; also the message key under `Projects.items`. */
  slug: string;
  order: number;
  featured: boolean;
  categories: ProjectCategory[];
  /** Technology names, shown as-is in both locales. */
  stack: string[];
  /** Calendar years; `end: null` means ongoing. `null` when unconfirmed. */
  period: { start: number; end: number | null } | null;
  /** Whether `Projects.items.<slug>.organization` exists. */
  hasOrganization: boolean;
  /** Whether `Projects.items.<slug>.role` exists. */
  hasRole: boolean;
  publishApproved: boolean;
};

export const projects: readonly Project[] = [
  {
    slug: "digital-banking-integration",
    order: 1,
    featured: true,
    categories: ["banking", "architecture", "backend"],
    stack: ["Java", "Spring Boot", "Microservices", "Banking APIs"],
    period: { start: 2026, end: null },
    hasOrganization: true,
    hasRole: true,
    publishApproved: false,
  },
  {
    slug: "pos-payment-aggregation",
    order: 2,
    featured: true,
    categories: ["banking", "backend", "devops"],
    stack: ["Node.js", "NestJS", "Kafka", "Kubernetes", "PostgreSQL", "Redis"],
    period: { start: 2023, end: 2025 },
    hasOrganization: true,
    hasRole: true,
    publishApproved: false,
  },
  {
    slug: "zain-master-data-management",
    order: 3,
    featured: true,
    categories: ["architecture", "devops"],
    stack: ["Microservices", "Kubernetes", "ELK"],
    period: { start: 2019, end: 2023 },
    hasOrganization: true,
    hasRole: true,
    publishApproved: false,
  },
  {
    slug: "e15-government-receipts",
    order: 4,
    featured: false,
    categories: ["architecture", "backend"],
    stack: ["Java", "Android", "REST", "SQL Server", "SMS gateway"],
    period: null,
    hasOrganization: true,
    hasRole: true,
    publishApproved: false,
  },
  {
    slug: "tanfeeth-integration",
    order: 5,
    featured: false,
    categories: ["banking", "backend"],
    stack: ["Banking middleware", "APIs"],
    period: { start: 2026, end: null },
    hasOrganization: true,
    hasRole: true,
    publishApproved: false,
  },
  {
    slug: "goat-questions-generator",
    order: 6,
    featured: false,
    categories: ["backend", "devops"],
    stack: ["NestJS", "Python", "PostgreSQL", "n8n", "Kubernetes", "GPT"],
    period: null,
    hasOrganization: false,
    hasRole: false,
    publishApproved: false,
  },
  {
    slug: "romooz-ecommerce",
    order: 7,
    featured: false,
    categories: ["backend"],
    stack: ["NestJS", "MongoDB", "React"],
    period: null,
    hasOrganization: false,
    hasRole: false,
    publishApproved: false,
  },
  {
    slug: "sadad-billing",
    order: 8,
    featured: false,
    categories: ["backend", "devops"],
    stack: ["Node.js", "Kafka", "Kubernetes"],
    period: null,
    hasOrganization: false,
    hasRole: false,
    publishApproved: false,
  },
];

/**
 * Projects to render, sorted by `order`: approved ones everywhere, drafts only
 * in development (`npm run dev`), so production never shows unapproved work.
 */
export function getVisibleProjects(): Project[] {
  const showDrafts = process.env.NODE_ENV === "development";
  return projects
    .filter((p) => p.publishApproved || showDrafts)
    .sort((a, b) => a.order - b.order);
}
