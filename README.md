# Abdalla Misbah — personal website

Bilingual (English / Arabic) engineering portfolio. The full design and
implementation specification is in [`docs/design-spec.md`](docs/design-spec.md).

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 ·
next-intl · next-themes · Radix UI · Lucide. Fonts: Inter, IBM Plex Sans
Arabic, Noto Naskh Arabic, JetBrains Mono (all SIL OFL 1.1). Only free,
permissively licensed assets are used — see `/credits`.

## Development

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000 → redirects to /en or /ar
npm run build && npm start
npm run lint
```

`dev`, `typecheck` and `build` run `velite build` first, which compiles the
articles into `.velite/` (gitignored). After editing an article while
`npm run dev` is running, run `npx velite build` again (or keep
`npx velite dev` running in a second terminal).

## Structure

- `src/app/[locale]/` — pages; the root layout sets `lang`/`dir` per locale
- `src/app/global-not-found.tsx` — static bilingual 404 for unmatched URLs
- `src/proxy.ts` — locale detection and redirects (next-intl)
- `src/i18n/` — routing, navigation helpers, request config
- `messages/{en,ar}.json` — UI strings
- `src/content/{en,ar}/articles/<slug>.mdx` — articles (Velite, `velite.config.ts`);
  the file name is the slug, and the same slug in both folders means the
  article is translated. Frontmatter: `title`, `description`, `category`
  (`backend | banking | distributed | java | architecture`), `published`
  (`YYYY-MM-DD`), optional `updated`, `draft` and `relatedProject` (a slug
  from `src/data/projects.ts`). MDX components: `<Callout>`, `<Diagram>`,
  `<Ltr>` (`src/components/mdx/`)
- `src/components/layout/` — navbar, mobile menu, theme toggle, language switcher, footer
- `src/app/globals.css` — color, typography and font-stack tokens

Use logical CSS utilities (`ms-*`, `pe-*`, `start-*`, `text-start`) rather than
left/right ones so layouts mirror correctly in Arabic.
