# Factory backlog

`/factory next` takes the first unchecked item, ticks it and appends the job id.
Add one feature per line; reference `docs/design-spec.md` sections where useful.

- [x] Homepage hero: conceptual architecture diagram as an inline SVG beside the intro, with localized caption (design-spec §4.2) → 001-hero-architecture-diagram
- [x] Homepage professional highlights strip: 15+ years, 8 engineers led, Java · Spring Boot (§4.3) → 002-highlights-strip
- [x] Homepage expertise section: four cards — Banking & Payments, Software Architecture, Backend Engineering, Cloud & DevOps (§4.6) → 003-expertise-section
- [x] Homepage about preview and final "Let's build something reliable" CTA section (§4.5, §4.10) → 004-about-preview-cta
- [x] sitemap.ts and robots.ts with en/ar hreflang alternates (§11.5) → 005-sitemap-robots
- [x] Security headers in next.config.ts: CSP without unsafe-eval, Referrer-Policy, Permissions-Policy, frame-ancestors (§11.8) → 006-security-headers
