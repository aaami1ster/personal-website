// Article categories (design spec §7). Shared by velite.config.ts, which
// validates frontmatter against them, and the pages, which label them via
// `Articles.categories.<category>` in messages/*.json.
export const articleCategories = [
  "backend",
  "banking",
  "distributed",
  "java",
  "architecture",
] as const;

export type ArticleCategory = (typeof articleCategories)[number];
