# Factory backlog

`/factory next` takes the first unchecked item, ticks it and appends the job id.
Add one feature per line; reference `docs/design-spec.md` sections where useful.

Content sources for every job: `docs/content/cv.md` (CV facts),
`docs/content/projects.md` (project material), `docs/content/public-context.md`
(public background figures, always cited and kept separate from Abdalla's own
claims). Every new page adds its path to `indexablePaths` in `src/lib/seo.ts`
(sitemap) and its strings to both `messages/en.json` and `messages/ar.json`.
Items marked **after:** depend on an earlier item being merged — don't run them
in parallel with it.

## Done

- [x] Homepage hero: conceptual architecture diagram as an inline SVG beside the intro, with localized caption (design-spec §4.2) → 001-hero-architecture-diagram
- [x] Homepage professional highlights strip: 15+ years, 8 engineers led, Java · Spring Boot (§4.3) → 002-highlights-strip
- [x] Homepage expertise section: four cards — Banking & Payments, Software Architecture, Backend Engineering, Cloud & DevOps (§4.6) → 003-expertise-section
- [x] Homepage about preview and final "Let's build something reliable" CTA section (§4.5, §4.10) → 004-about-preview-cta
- [x] sitemap.ts and robots.ts with en/ar hreflang alternates (§11.5) → 005-sitemap-robots
- [x] Security headers in next.config.ts: CSP without unsafe-eval, Referrer-Policy, Permissions-Policy, frame-ancestors (§11.8) → 006-security-headers

## 1 · Fix the dead navigation (Writing is still 404)

- [ ] Contact form hardening from job 011's security review: raise the /api/contact body cap so a valid max-length Arabic submission is accepted (or size limits from UTF-8 bytes); pass name and organization through singleLine() in the email body and widen singleLine() to strip control and bidi-override characters (subject and body); make the mailto builder safe for lone surrogates (toWellFormed before encodeURIComponent); and document in .env.example and README that X-Forwarded-For and the Origin/Host check assume Vercel or a proxy that sets them (§10.2) — see factory/jobs/011-contact-page/round-1/review-security.md for file:line details
- [ ] Vercel readiness — shared contact rate limit: when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, /api/contact uses an Upstash Redis fixed-window limit (5 per IP per hour, keys expire with the window) through Upstash's REST API with fetch (no new dependency unless justified); otherwise keep the in-memory limiter. Update /privacy (both languages) so the rate-limit paragraph is true in both modes and names Upstash as a processor when used; document the env vars in .env.example and README (§10.2, §11.8) — after: contact form hardening
- [x] Projects gallery polish from job 009 reviews: keep stack tags in source order on Arabic pages (dir="ltr" on the tag list), stop the Arabic "organisation · role · period" meta line from orphaning the "·" or splitting the period (keep each part together, wrap between parts), show full card summaries instead of cutting them mid-sentence with line-clamp, and use stable keys for meta-line parts (§4.7, §9.3) → 010-projects-polish
- [x] Typed bilingual experience data in src/data/experience.ts (six roles, exact titles/dates/bullets from docs/content/cv.md, EN + AR) and the /experience page timeline with education and training sections (§6.2, §3); training items stay "training" unless docs/content/cv.md marks them confirmed → 007-experience-page
- [x] /about page: professional story copy from §6.1, engineering philosophy, education (University of Khartoum, B.Sc. EEE 1st Class Honours 2007, embedded systems, UAV final project) and languages; no portrait (§6.1, §14 #3) → 008-about-page
- [x] Projects data in src/data/projects.ts (the eight projects in docs/content/projects.md, with category, stack, role, period, publishApproved=false gate) and the /projects gallery with category filters as URL search params; wire the homepage expertise cards to /projects?category=… (§3, §4.6, §4.7) — after: experience page → 009-projects-gallery
- [x] /contact page with the §10.1 form (Zod schema shared client/server), honeypot, min-fill-time and per-IP rate limit in app/api/contact/route.ts; send via Resend only when RESEND_API_KEY is set, otherwise show the mailto fallback; switch the homepage "Get in Touch" CTA from mailto to /contact (§10) → 011-contact-page
- [x] /privacy page describing exactly what the contact form and any analytics collect, retention, and who to contact; link it from the contact form consent checkbox and the footer (§10.2) → 012-privacy-page
- [ ] /articles index and /articles/[slug] MDX pipeline (Velite or @next/mdx, Shiki highlighting at build time, table of contents, reading time, Callout/Diagram/Ltr components); show "English only" badges for untranslated articles; navigation link "Writing" works with zero or more articles (§7) — no placeholder articles

## 2 · Homepage completeness

- [ ] Printable /cv page rendered from src/data/experience.ts with a print stylesheet (A4, no navigation chrome) so "Download CV" always matches the site and never shows the phone number; offer the PDF in public/cv/ only if Abdalla adds a phone-free PDF (§4.2, §10.1)
- [ ] Hero CTAs: "Explore My Work" (scrolls to #selected-work, falls back to /projects) and "Download CV" linking to /cv; RTL arrow flip (§4.2) — after: projects data, /cv page
- [ ] Homepage experience preview: abbreviated vertical timeline of the six roles from src/data/experience.ts with "Full experience" link; rail on the right in Arabic (§4.8) — after: experience page
- [ ] Homepage selected-work section (#selected-work): three featured project cards with consistent SVG thumbnails, category badge, stack tags and "View case study" (§4.7) — after: projects data
- [ ] Homepage writing preview: three latest published articles, or the "How I approach engineering" philosophy block while there are none (§4.9) — after: articles pipeline

## 3 · Case studies (one job each; each ships with publishApproved=false until Abdalla approves)

- [ ] Case study: E15 — National Electronic Government Receipt System, Internet/SMS adaptive transport, compact SMS protocol, three telecom operators, idempotency and end-to-end tracing, with an architecture diagram component; public background from docs/content/public-context.md cited separately (§5) — after: projects data
- [ ] Case study: Digital banking & payment integration at Sunna Al Tamyuz — CBS/PSH, internal, IPS/SARIE, SWIFT, GCC, Host-to-Host, MTO flows; conceptual request-flow diagram; no throughput or compliance claims (§5.1) — after: projects data
- [ ] Case study: POS aggregation / SoftPOS platform at Rasid Payments — Kafka event-driven processing, reconciliation, idempotency and retries, observability (§5) — after: projects data
- [ ] Case study: Master Data Management platform for Zain Sudan at Musafer — microservices on Kubernetes, ELK, leading an 8-person team; Zain Sudan market context cited, no subscriber-volume claims for the platform (§5) — after: projects data

## 4 · SEO, sharing and quality

- [ ] Open Graph and Twitter card images: next/og 1200×630 per page using the AM. monogram and navy palette; static pre-designed PNG fallback for Arabic if Satori shapes Arabic incorrectly; og/twitter meta in generateMetadata (§11.5, §2.4)
- [ ] JSON-LD structured data: ProfilePage + Person on home and about (name, jobTitle, address locality, sameAs GitHub/LinkedIn), BreadcrumbList on case studies and articles, BlogPosting on articles (§11.5)
- [ ] Turn off the X-Powered-By header (poweredByHeader: false) and add HSTS includeSubDomains only after confirming every subdomain of abdallamisbah.com is HTTPS-only (§11.8)
- [ ] GitHub Actions CI: npm ci + npm run verify on every push and pull request to main, Node version from package.json engines, npm cache (§11.9)
- [ ] Playwright e2e suite: every route in en and ar with correct lang/dir, language switch keeps the page, mobile menu focus management, no horizontal scroll at 360px, axe scan with zero serious/critical violations in both themes (§11.9, §11.7)
- [ ] Hero diagram polish from job 001 reviews: keep the "·" in "IPS/SARIE · SWIFT" when the label wraps, centre the Event Bus label under the node column, and generate SVG ids with React useId (§4.2)

## 5 · Features that set the site apart

- [ ] Interactive terminal: collapsed "Prefer the command line?" bar under the highlights, fixed command registry (help, whoami, about, skills, projects, experience, contact, github, linkedin, resume, theme, clear), confirm-before-open for links, role="log", history and tab completion, lazy-loaded (§8, §4.4)
- [ ] First article from the E15 story: "Transport-agnostic transactions: building payments that survive without internet" — separating business transactions from transport, compact SMS encoding, correlation IDs and idempotency across unreliable channels (§7) — after: articles pipeline, E15 case study
- [ ] RSS/Atom feed at /feed.xml for published articles with autodiscovery <link> in the head (§7) — after: articles pipeline
- [ ] /now page (nownownow.com convention): what Abdalla is focused on this month, with a visible "last updated" date; content needs Abdalla's input
- [ ] /uses page: hardware, editor, terminal and engineering tools Abdalla uses day to day; content needs Abdalla's input
- [ ] Availability badge ("Open to opportunities") behind a config flag in src/lib/site.ts, off by default (§4.2, §14 #2)
- [ ] Privacy-friendly analytics: self-hosted Umami (MIT, cookieless) script behind an env var, CSP updated to allow only that origin, mentioned on /privacy (§10.2, §14 #7) — after: /privacy page

## Needs you (not factory jobs)

- Approve each case study for publication (and get employer permission where it names Sunna Al Tamyuz, Rasid, Musafer/Zain or Tanfeeth).
- Confirm in `docs/content/cv.md`: PMP and ITIL — certification or training? Which "Sadad" project, and for which employer? Employer for GOAT / Al Qodurat and ROMOOZ.
- Native-speaker review of all Arabic copy (diagram labels, highlights, expertise, about, CTA).
- A phone-free CV PDF (English, and Arabic if you want one) for public/cv/.
- Deploy: create the Vercel project, add abdallamisbah.com and www, set DNS, pick bare vs www as canonical.
- Content for /now and /uses.
