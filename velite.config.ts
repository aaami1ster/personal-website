import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";
import { articleCategories } from "./src/data/articles";
import { projects } from "./src/data/projects";

// Content layer (design spec §7, §11.1). Velite runs in Node before
// `next typegen` and `next build` (see package.json), so the rehype plugins
// below, including Shiki highlighting, run at build time only: the pages
// receive compiled MDX and ship no highlighting code to the browser.

const projectSlugs = projects.map((p) => p.slug);

// "2026-10-27": a calendar date, which is what formatDate() expects.
const isoDate = () =>
  s
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO calendar date (YYYY-MM-DD)")
    .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), "Invalid date");

const articles = defineCollection({
  name: "Article",
  // src/content/<locale>/articles/<slug>.mdx: the file name is the slug, and
  // the same slug in both folders means the article is translated.
  pattern: "{en,ar}/articles/*.mdx",
  schema: s
    .object({
      title: s.string().min(1).max(160),
      description: s.string().min(1).max(320),
      category: s.enum(articleCategories),
      published: isoDate(),
      updated: isoDate().optional(),
      draft: s.boolean().default(false),
      relatedProject: s
        .string()
        .refine((v) => projectSlugs.includes(v), {
          message: `relatedProject must be one of: ${projectSlugs.join(", ")}`,
        })
        .optional(),
      path: s.path(),
      toc: s.toc({ minDepth: 2, maxDepth: 3 }),
      metadata: s.metadata(),
      body: s.mdx(),
    })
    .transform(({ path, metadata, ...data }) => {
      // path is "en/articles/<slug>".
      const [locale, , slug] = path.split("/");
      return {
        ...data,
        locale: locale as "en" | "ar",
        slug,
        readingTime: Math.max(1, metadata.readingTime),
      };
    }),
});

export default defineConfig({
  root: "src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { articles },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Both themes are emitted as CSS variables (--shiki-light,
          // --shiki-dark); globals.css picks one from the theme attribute.
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
          defaultLang: { block: "plaintext" },
        },
      ],
    ],
  },
});
