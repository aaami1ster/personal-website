# Abdalla Misbah — Personal Website Design Specification

**Version:** 1.2 (consolidated) · **Status:** Approved for implementation · **Stack:** Next.js · **Languages:** English + Arabic

| Version | Change |
|---|---|
| 1.0 | Original specification: concept A "Engineering Architect", dark-first with light toggle, bilingual, blog, terminal, contact form, diagrams. |
| 1.1 | Thmanyah typography proposal. **Superseded by 1.2.** |
| 1.2 | **Free / open-source assets only.** Thmanyah removed. Final fonts: Inter, IBM Plex Sans Arabic, Noto Naskh Arabic, JetBrains Mono. Icons: Lucide. All third-party assets must carry a verified permissive license. |

A premium engineering portfolio built around Abdalla's professional identity as a Senior Software Engineer specializing in banking integration, backend architecture, payments, and enterprise systems.

> **Content rule.** All copy below is based on the CV. Marketing phrasing and visual treatments are design recommendations, not claims of additional experience. Do not add invented metrics (transaction volumes, uptime, latency gains, revenue, certifications). Items marked **[CV]** must be filled from the CV verbatim; items marked **[TBD]** are open decisions (see §14).

---

## 1. Goals and positioning

### 1.1 Audiences

| Audience | What they need in < 30 seconds | Primary path |
|---|---|---|
| Recruiters & employers | Role, seniority, location, stack, CV | Hero → Highlights → **Download CV** |
| Engineering managers & architects | Depth of system design and leadership | Selected Work → Case studies → Experience |
| Potential clients / consulting | Domain fit (banking, payments, integration), how to reach him | Expertise → Case studies → Contact (inquiry type: Consulting) |
| Developers & technical community | Technical writing, opinions, code | Writing → Articles → Terminal |

### 1.2 Questions the site must answer

1. Who is Abdalla, and what does he specialize in?
2. What complex systems has he designed, built, or integrated?
3. What technical and leadership experience does he bring?
4. How can I contact him, download his CV, or review his work?

### 1.3 Positioning

Banking and fintech lead, without restricting him to financial services — telecommunications, enterprise software, and education projects demonstrate breadth.

**CTA hierarchy:** 1) **Explore My Work** (primary) · 2) **Download CV** (secondary) · 3) **Get in Touch** (tertiary / final section).

**Tone:** a professional engineering portfolio — not a bank's marketing site, not a crypto landing page, not a generic résumé template. The real engineering experience, not decorative animation, is the attraction.

---

## 2. Visual identity and design system

### 2.1 Design direction — "Engineering Architect"

Tagline: **Build. Integrate. Scale.**

Restrained enterprise professionalism + contemporary engineering aesthetics + technically meaningful diagrams. Principles: dark-first, bilingual by design, architecture-led, mobile-first.

### 2.2 Color tokens

Implement as semantic CSS variables. Initial theme follows `prefers-color-scheme`; the manual toggle persists the choice in `localStorage` (via `next-themes`, MIT) and must not flash the wrong theme on load.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#0B1220` | `#F8FAFC` | Page background |
| `--surface` | `#111D30` | `#FFFFFF` | Elevated surfaces, cards |
| `--border` | `#1E293B` | `#E2E8F0` | Borders, dividers, card outlines |
| `--accent` | `#38BDF8` | `#0369A1` | Links, highlights, diagram strokes, focus ring |
| `--cta-bg` | `#0369A1` ⚠ | `#0369A1` | Primary button background (text `#FFFFFF`) |
| `--success` | `#10B981` | `#047857` | Availability badge, form success |
| `--text` | `#F8FAFC` | `#0F172A` | Primary text |
| `--text-muted` | `#94A3B8` | `#475569` | Secondary text, metadata |
| `--danger` | `#F87171` | `#B91C1C` | Form errors |

⚠ **Contrast correction.** v1.0 specified `#0284C7` as the CTA background. White text on `#0284C7` is ≈ 4.1:1, which fails WCAG AA for normal-size button labels (4.5:1). Use `#0369A1` (≈ 5.9:1 with white) for the CTA in both themes, and keep `#0284C7` only for hover/large decorative elements. Verify every pair with a contrast checker before release.

### 2.3 Typography — final (v1.2)

All fonts are licensed under the **SIL Open Font License 1.1**, which permits free commercial use, embedding, and self-hosting.

| Role | English | Arabic |
|---|---|---|
| Hero & page headings (H1–H2) | **Inter** 700 | **IBM Plex Sans Arabic** 700 |
| Card & sub-headings (H3–H4) | Inter 600 | IBM Plex Sans Arabic 600 |
| Body & interface | Inter 400 / 500 | IBM Plex Sans Arabic 400 / 500 |
| Long-form articles & case studies (body) | Inter 400 | **Noto Naskh Arabic** 400 (bold 700) |
| Headings inside articles | Inter 600–700 | IBM Plex Sans Arabic 600–700 |
| Code, terminal, API paths | **JetBrains Mono** 400 / 500 (700 for emphasis) | JetBrains Mono (content stays LTR) |

**Weights to load (only these):**

| Font | Type | Weights | Subsets |
|---|---|---|---|
| Inter | Variable | 400–700 range | `latin`, `latin-ext` |
| IBM Plex Sans Arabic | Static | 400, 500, 600, 700 | `arabic` |
| Noto Naskh Arabic | Variable | 400, 700 | `arabic` |
| JetBrains Mono | Variable | 400, 500, 700 | `latin` |

No synthetic bolding: never request a weight that is not loaded.

**Mixed-script strategy (as implemented).** The Arabic stack puts Inter *first*: `Inter, IBM Plex Sans Arabic, …`. Inter has no Arabic glyphs, so Arabic letters fall through to the Arabic face, while Latin technical terms inside Arabic paragraphs (Java, Spring Boot, Kafka, IPS/SARIE) render in Inter and look identical on both language versions. The Arabic stack must reference Inter **without** next/font's generated `Inter Fallback` face: that face is local Arial, which contains Arabic glyphs and would otherwise shadow IBM Plex Sans Arabic. The layout exposes the bare face as `--font-inter-face` (see `src/lib/fonts.ts`). (`adjustFontFallback: false` would be simpler, but Turbopack ignores it in Next.js 16.4.)

#### Responsive type scale

| Element | Mobile | Desktop | EN family | AR family |
|---|---|---|---|---|
| Hero H1 | 36–44px | 60–72px (AR: 52–64px) | Inter 700 | Plex Arabic 700 |
| Page H1 | 34–40px | 48–60px | Inter 700 | Plex Arabic 700 |
| Section H2 | 28–32px | 36–44px | Inter 700 | Plex Arabic 700 |
| Card H3 | 20px | 22–26px | Inter 600 | Plex Arabic 600 |
| Body | 16px | 17–18px (AR: 17–19px) | Inter 400 | Plex Arabic 400 |
| Article body | 18px | 19–20px | Inter 400 | Noto Naskh 400 |
| Navigation | 14px | 15px | Inter 500 | Plex Arabic 500 |
| Metadata / badges | 12–13px | 13–14px | Inter 500 | Plex Arabic 500 |
| Code | 13px | 14–15px | JetBrains Mono | JetBrains Mono |

Starting tokens (tune after testing real metrics on device):

```css
:root {
  --text-hero:    clamp(2.25rem, 1.4rem + 3.6vw, 4.5rem);
  --text-page:    clamp(2.125rem, 1.5rem + 2.6vw, 3.75rem);
  --text-section: clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem);
  --text-card:    clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem);
  --text-body:    clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --text-article: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
}

html[lang="en"] {
  --font-sans:    var(--font-inter), system-ui, sans-serif;
  --font-reading: var(--font-inter), system-ui, sans-serif;
}
html[lang="ar"] {
  --font-sans:    var(--font-plex-arabic), var(--font-inter), system-ui, sans-serif;
  --font-reading: var(--font-naskh), var(--font-plex-arabic), var(--font-inter), serif;
  --text-hero:    clamp(2.25rem, 1.5rem + 3vw, 4rem);
}
:root { --font-mono: var(--font-jetbrains), ui-monospace, monospace; }

body            { font-family: var(--font-sans); font-size: var(--text-body); line-height: 1.65; }
h1, h2, h3      { font-family: var(--font-sans); line-height: 1.2; }
.prose-article  { font-family: var(--font-reading); font-size: var(--text-article);
                  line-height: 1.8; max-width: 70ch; }
code, pre, .terminal { font-family: var(--font-mono); }

/* Arabic needs more vertical room for ascenders/descenders and diacritics */
[lang="ar"]            { line-height: 1.85; }
[lang="ar"] :is(h1,h2) { line-height: 1.45; }
[lang="ar"] .prose-article { line-height: 2; }

/* Tight tracking only for Latin display text — never letter-space Arabic */
[lang="en"] :is(h1,h2) { letter-spacing: -0.02em; }
```

Use `font-display: swap` (the `next/font` default). Preload only Inter (latin). Both locales share one root layout, so `next/font` cannot preload per locale; IBM Plex Sans Arabic, Noto Naskh Arabic and JetBrains Mono load on demand (`preload: false`), with Plex's metric-adjusted fallback limiting layout shift on Arabic pages.

### 2.4 Logo — "AM." monogram

Typographic monogram **AM.** with the period in `--accent`. Wordmark lockup: `AM.` + `ABDALLA MISBAH` / `SOFTWARE ENGINEER` (Inter 600, uppercase, +0.08em tracking — Latin only). Arabic lockup: `عبدالله مصباح` / `مهندس برمجيات` in Plex Arabic 600, no tracking.

Deliver as hand-built SVG (outlined paths, no font dependency) in four variants: navbar (24–32px), favicon (16/32px + `icon.svg` + `apple-icon.png` 180px), footer, Open Graph. Must remain legible at 16px — test the favicon at actual size.

### 2.5 Iconography

**Lucide** (ISC license) for all interface icons: `ArrowRight`, `ArrowDown`, `Download`, `Mail`, `MapPin`, `Building2`, `Terminal`, `Sun`, `Moon`, `Languages`, `Menu`, `X`, `ExternalLink`, `Clock`, `Calendar`.

- Directional icons (`ArrowRight`, `ChevronRight`) must flip in RTL (`rtl:-scale-x-100`). Non-directional icons (`Download`, `Mail`) do not flip.
- **Brand logos (GitHub, LinkedIn):** Lucide has deprecated its brand icons. Use text labels with a generic icon (e.g. `ExternalLink`), or the official marks downloaded from each company's brand-assets page and used per their guidelines. Do not use paid or unclear-license icon packs.
- Icon-only buttons need an accessible label in both languages.

### 2.6 Motion

Restrained: subtle glow on diagram nodes, card hover lift (translate 2px + border color), section fade-up on first reveal (≤ 300ms, once). Use **Motion** (MIT).

Under `prefers-reduced-motion: reduce`: no reveals, no glow pulses, no transforms — instant state changes only.

**Never:** continuous particle backgrounds, page-wide fake code typing, or any animation that delays access to content.

### 2.7 Layout grid & spacing

- 12-column grid, max content width 1200px, gutters 24px (desktop) / 16px (mobile).
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px. Section vertical padding: 96px desktop / 64px mobile.
- Radius: 8px (inputs, badges), 12px (cards), 16px (hero diagram panel).
- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).

### 2.8 Asset licensing policy (v1.2)

Only free, open-source assets with permissive licenses. No paid fonts, proprietary icon packs, subscription asset libraries, or components requiring a commercial license.

| Asset | Choice | License |
|---|---|---|
| English typography | Inter | OFL 1.1 |
| Arabic headings & UI | IBM Plex Sans Arabic | OFL 1.1 |
| Arabic long-form | Noto Naskh Arabic | OFL 1.1 |
| Code & terminal | JetBrains Mono | OFL 1.1 |
| Icons | Lucide | ISC |
| UI components | shadcn/ui + Radix primitives | MIT |
| Logo, diagrams, project graphics, decorative elements | Custom SVG (owned) | — |

- Thmanyah fonts are **excluded**.
- Any third-party image must have verified permission for commercial use; record its source and license in `docs/asset-sources.md`.
- Keep required notices: add a **Credits & Licenses** section (footer link → `/[locale]/credits`) listing each font/icon set with its license and link to the license text.

---

## 3. Information architecture

| Route | Content |
|---|---|
| `/[locale]` | Home: hero, highlights, terminal (collapsed), about preview, expertise, selected work, experience preview, writing preview, final CTA |
| `/[locale]/about` | Professional story, background, engineering philosophy, education, training |
| `/[locale]/projects` | Portfolio grid with category filters |
| `/[locale]/projects/[slug]` | Case study |
| `/[locale]/experience` | Full career timeline |
| `/[locale]/articles` | Article index with category filter |
| `/[locale]/articles/[slug]` | Article (MDX) |
| `/[locale]/contact` | Contact form, profile links, email |
| `/[locale]/credits` | Open-source credits and licenses |
| `/[locale]/privacy` | Privacy notice (form + analytics) |

- `locale ∈ { en, ar }`; both locales share the **same** information architecture and slugs (slugs stay English for stable URLs).
- `/` redirects to `/en` or `/ar` based on `Accept-Language`, then the visitor's explicit choice (cookie).
- The language switcher keeps the visitor on the equivalent page (`/en/projects/x` ↔ `/ar/projects/x`).

---

## 4. Homepage — layout and copy

### 4.0 Wireframes

**Desktop (≥ 1024px)**

```
┌────────────────────────────────────────────────────────────────────────┐
│ AM.            About  Projects  Experience  Writing  Contact   ☾  عربي │  sticky, translucent
├────────────────────────────────────────────────────────────────────────┤
│ SOFTWARE ENGINEERING · BANKING · FINTECH      ┌──────────────────────┐ │
│                                               │ SYSTEM ARCHITECTURE  │ │
│ Hi, I'm Abdalla Misbah.                       │ / CONCEPTUAL VIEW    │ │
│ Senior Software Engineer.                     │  [Channels]          │ │
│ Building reliable systems for banking,        │      │               │ │
│ fintech & enterprise.                         │  [API Gateway]       │ │
│                                               │      │               │ │
│ I'm a software engineer with 15+ years…       │  [Integration Mw]──┐ │ │
│                                               │   │      │      │  │ │ │
│ ⌖ Riyadh, Saudi Arabia   ▣ Banking & Fintech  │ [Core] [Pay] [Dom] │ │ │
│                                               │  ════ Kafka ═══════┘ │ │
│ [ Explore My Work → ]  [ Download CV ↓ ]      │ Concept illustration │ │
│        cols 1–7                               └──── cols 8–12 ───────┘ │
├────────────────────────────────────────────────────────────────────────┤
│   15+ Years of experience  │  8 Engineers led  │  Java · Spring Boot    │
├────────────────────────────────────────────────────────────────────────┤
│ ▸ Prefer the command line? Open terminal                                │
├────────────────────────────────────────────────────────────────────────┤
│ About preview (2 paragraphs + link)                                     │
│ Expertise: [Banking & Payments][Architecture][Backend][Cloud & DevOps] │
│ Selected work: [Case 1] [Case 2] [Case 3]                 View all →   │
│ Experience preview (vertical timeline, 6 entries)          Full →      │
│ Writing preview (3 latest) — or Engineering Philosophy until published │
│ Final CTA: Let's build something reliable.          [Get in Touch →]   │
├────────────────────────────────────────────────────────────────────────┤
│ AM.  © 2026 Abdalla Misbah · GitHub · LinkedIn · Email · Credits       │
└────────────────────────────────────────────────────────────────────────┘
```

**Mobile (< 768px):** single column. Order: navbar (logo + theme + language + hamburger) → hero text → CTAs (full width, stacked) → diagram (simplified vertical variant, below CTAs) → highlights (3 stacked rows) → remaining sections. Arabic pages mirror the entire layout (diagram moves to the inline-start-opposite side automatically via logical properties).

### 4.1 Navigation

- Sticky; background `--bg` at 80% opacity + `backdrop-blur`; 1px bottom border appears after 8px scroll.
- Desktop: `AM.` logo · About · Projects · Experience · Writing · Contact · theme toggle · language switcher (`عربي` on EN pages, `English` on AR pages).
- Active page indicated with `aria-current="page"` and an accent underline.
- Mobile: accessible hamburger (Radix Dialog/Sheet): focus trapped while open, `Esc` closes, focus returns to the trigger.
- Skip link "Skip to content" as first focusable element.

### 4.2 Hero

| Element | English | Arabic |
|---|---|---|
| Eyebrow | SOFTWARE ENGINEERING · BANKING · FINTECH | هندسة البرمجيات · الأنظمة المصرفية · التقنية المالية |
| H1 line 1 | Hi, I'm Abdalla Misbah. | مرحباً، أنا عبدالله مصباح. |
| H1 line 2 (accent) | Senior Software Engineer. | مهندس برمجيات أول. |
| Subheading | Building reliable systems for banking, fintech & enterprise. | أبني أنظمة موثوقة للخدمات المصرفية والتقنية المالية والمؤسسات. |
| Intro | I'm a software engineer with 15+ years of experience designing and integrating enterprise platforms. I specialize in Java, Spring Boot, microservices, event-driven architecture, and complex payment and banking integrations. | مهندس برمجيات بخبرة تزيد على 15 عاماً في تصميم المنصات المؤسسية وتكاملها. أتخصص في Java وSpring Boot والخدمات المصغّرة (Microservices) والمعمارية القائمة على الأحداث، وفي تكاملات المدفوعات والأنظمة المصرفية المعقدة. |
| Meta chips | Riyadh, Saudi Arabia · Banking & Fintech | الرياض، المملكة العربية السعودية · الخدمات المصرفية والتقنية المالية |
| Primary CTA | Explore My Work → | استكشف أعمالي ← |
| Secondary CTA | Download CV ↓ | تحميل السيرة الذاتية ↓ |

- "Explore My Work" scrolls to `#selected-work` (or links to `/projects` when JS is unavailable).
- "Download CV" links to the locale's PDF (`/cv/Abdalla_Misbah_CV_en.pdf` / `_ar.pdf`) with `download` attribute and file size in the label: "Download CV (PDF, 180 KB)".
- **Availability badge** (`● Open to opportunities`, `--success`): hidden by default; enabled only via a config flag when Abdalla explicitly wants to signal it.

**Hero diagram — "System Architecture / Conceptual View"**

Inline SVG React component, server-rendered (no layout shift; it is the likely LCP candidate on desktop, so it must not depend on JS).

```
 Digital Channels (Mobile · Web · Partners)
              │
         API Gateway
              │
   Integration Middleware ─────────────┐
     │            │             │      │
 Core Banking  Payment Hub   Domain    │
               (IPS/SARIE,   Services  │
                SWIFT)                 │
 ══════════════ Event Bus (Kafka) ═════╛
```

- Caption under the panel: *"Concept illustration — not a real bank system topology."* (AR: *"رسم توضيحي للمفهوم — لا يمثل بنية نظام مصرفي حقيقي."*)
- Nodes: `--surface` fill, `--border` stroke, labels in Inter/JetBrains Mono 12–13px. Edges in `--accent` at 60% opacity.
- Progressive enhancement (client, after hydration, motion allowed): a soft glow travels along edges every ~6s; hovering a node highlights its edges.
- Provide `<title>` and `<desc>` in the SVG; the diagram is decorative-informative, so a short text alternative suffices.
- Node labels stay English in both locales (technical names), but the panel title and caption are localized.

### 4.3 Professional highlights

| Figure | Label (EN) | Label (AR) |
|---|---|---|
| 15+ | Years of experience | سنوات من الخبرة |
| 8 | Engineers led | مهندسين تحت قيادتي |
| Java | Spring Boot & backend | Spring Boot والأنظمة الخلفية |

Only CV-backed figures. Do not add transaction volumes, uptime percentages, or revenue figures. Render numbers with Western digits in both locales (see §9.4).

### 4.4 Terminal entry point

Directly below the highlights: a single-line collapsed bar `▸ Prefer the command line? Open terminal` (button, `aria-expanded`). Expanding reveals the terminal (§8). The terminal is optional — nothing on the site requires it.

### 4.5 About preview

**H2:** Engineering systems that connect businesses, technology, and people.
**AR:** أنظمة هندسية تربط الأعمال والتقنية والناس.

> My career spans more than 15 years across digital banking, fintech, telecommunications, and enterprise software. I have worked as a software engineer, backend team lead, and software architect, designing systems that integrate complex platforms and support critical business operations.
>
> My work combines hands-on backend development with architecture, technical leadership, and cross-team collaboration. I focus on reliable APIs, resilient integration patterns, maintainability, and practical engineering decisions.

> **AR:** تمتد مسيرتي المهنية لأكثر من 15 عاماً في الخدمات المصرفية الرقمية والتقنية المالية والاتصالات والبرمجيات المؤسسية. عملت مهندس برمجيات وقائد فريق للأنظمة الخلفية ومعماري برمجيات، وصمّمت أنظمة تربط بين منصات معقدة وتدعم عمليات أعمال حيوية.
>
> يجمع عملي بين التطوير العملي للأنظمة الخلفية والتصميم المعماري والقيادة التقنية والتعاون بين الفرق. أركّز على واجهات برمجية موثوقة، وأنماط تكامل مرنة، وقابلية الصيانة، وقرارات هندسية عملية.

Link: **More about me →** / **المزيد عني ←**

### 4.6 Expertise

Four cards in a 4-col (desktop) / 2-col (tablet) / 1-col (mobile) grid. Each card: Lucide icon, title, one line, link to filtered projects.

| Card | Description | Links to |
|---|---|---|
| Banking & Payments | Core banking, payment hubs, IPS/SARIE, SWIFT and middleware integration. | `/projects?category=banking` |
| Software Architecture | Microservices, event-driven systems, CQRS and distributed integration patterns. | `/projects?category=architecture` |
| Backend Engineering | Java, Spring Boot, Node.js, NestJS and API development. | `/projects?category=backend` |
| Cloud & DevOps | Kubernetes, Kafka, Docker, CI/CD and observability. | `/projects?category=devops` |

AR titles: الخدمات المصرفية والمدفوعات · معمارية البرمجيات · هندسة الأنظمة الخلفية · الحوسبة السحابية وDevOps.

### 4.7 Selected work (`#selected-work`)

Three featured projects; the fourth appears only in the full gallery.

| Project | Homepage emphasis | Thumbnail |
|---|---|---|
| Digital Banking & Payment Integration | Payment and core-banking integration architecture | Mini SVG: channels → middleware → core/payments |
| POS & Payment Aggregation | Reliable transaction processing and event-driven workflows | Mini SVG: terminals → aggregator → event bus → acquirers |
| Enterprise Master Data Management | Scalable telecommunications data platform | Mini SVG: sources → MDM hub → consumers |
| **[CV]** Fourth project | Gallery only | — |

Card anatomy: 16:9 SVG thumbnail (same visual language as the hero diagram) · category badge · title · 2-line description · up to 4 tech tags (JetBrains Mono, 12px) · **View Case Study →**. Whole card is clickable via one `<a>` (no nested links).

### 4.8 Experience preview

Abbreviated vertical timeline, six entries: role · organization · dates · one-line contribution **[CV]**. Link: **Full experience →**. In RTL the timeline rail sits on the right.

### 4.9 Writing preview

Show the three latest **published** articles (category, title, excerpt, date, reading time). Never show empty or placeholder article cards.

Until the first article is published, show an **Engineering Philosophy** block instead:

> **How I approach engineering.** Solve the right problem with the appropriate level of complexity. Prioritize clarity, reliability, maintainability, and effective collaboration over unnecessary abstraction.

### 4.10 Final CTA

**H2:** Let's build something reliable. · **AR:** لنبنِ معاً أنظمة موثوقة.

Interested in backend engineering, banking integration, system architecture, or technical collaboration? I'd be glad to connect.
**AR:** هل تهتم بهندسة الأنظمة الخلفية أو التكامل المصرفي أو معمارية الأنظمة أو التعاون التقني؟ يسعدني التواصل معك.

Button: **Get in Touch →** / **تواصل معي ←**

### 4.11 Footer

`AM.` mark · © {year} Abdalla Misbah · GitHub · LinkedIn · Email · Privacy · Credits & Licenses · language switcher.

---

## 5. Project case studies

Each case study tells a technical story. Template (MDX, same headings in both locales):

1. **Overview** — business problem, context, scope.
2. **My Role** — personal responsibilities vs. team ownership (be explicit).
3. **Requirements** — functional and non-functional.
4. **Architecture** — sanitized component diagram + key design decisions (decision, alternatives, rationale).
5. **Implementation** — stack, patterns, integrations, testing, deployment approach.
6. **Challenges** — real constraints and how they were addressed.
7. **Outcome** — verified results, delivered capabilities, lessons learned.

**Page layout:** header (eyebrow, title, org · role, tech tags) → sticky in-page TOC on desktop (start side) → content at 70ch → "Related articles" → previous/next case study.

**Frontmatter schema:**

```yaml
title: Digital Banking & Payment Integration
slug: digital-banking-integration
organization: Sunna Al Tamyuz
role: Senior Software Engineer — Integration
period: 2026–present
categories: [banking, architecture, backend]
tags: [Java, Spring Boot, Microservices, Banking APIs]
featured: true
order: 1
summary: "…"
publishApproved: false   # must be true before it renders in production
```

### 5.1 Example — Digital Banking & Payment Integration

**Eyebrow:** FEATURED CASE STUDY · **Org/role:** Sunna Al Tamyuz · Senior Software Engineer — Integration · **Tags:** Java · Spring Boot · Microservices · Banking APIs

- **Overview.** Contributed to a digital banking middleware platform connecting digital channels with core banking, payment services, and banking domain systems.
- **Engineering scope.** Designed and implemented payment and transfer integrations, reviewed API contracts, mapped data across system boundaries, and supported testing and deployment readiness.
- **Integration domains.** Internal transfers, IPS/SARIE, SWIFT, GCC transfers, Host-to-Host, and Money Transfer Operator services.
- **Challenges to discuss.** Contract mismatches, validation requirements, error mapping, traceability, and coordinating multiple dependent systems.
- **Architecture.** Conceptual request flow: channels → middleware → core banking / payment services / domain services, with event infrastructure.

Do **not** claim production throughput, latency improvements, compliance certifications, or quantified reliability outcomes without approved evidence. Obtain employer permission before publishing any employer-related detail (`publishApproved` gate).

---

## 6. About and Experience pages

### 6.1 About — copy

**About Abdalla**

I'm a Senior Software Engineer based in Riyadh, Saudi Arabia, with more than 15 years of experience in backend development, software architecture, and enterprise integration.

My professional journey began in software and embedded systems engineering and expanded into enterprise platforms, telecommunications, fintech, and digital banking.

Today, I focus primarily on Java and Spring Boot, microservices, payment integrations, and event-driven architectures. I enjoy working across the full engineering lifecycle, from understanding business requirements and defining API contracts to designing, implementing, testing, and deploying reliable backend services.

I have also led engineering teams, reviewed architectures, mentored developers, and worked with product owners, platform engineers, security teams, and external technology providers.

My engineering philosophy is to solve the right problem with the appropriate level of complexity: prioritize clarity, reliability, maintainability, and effective collaboration over unnecessary abstraction.

**Sections below the story:** Engineering philosophy (3 short principles) · Education · Professional training · Optional portrait **[TBD]** (WebP/AVIF, explicit width/height, not the LCP element on mobile).

### 6.2 Experience — timeline (exact roles and periods from the CV)

| Period | Organization | Role |
|---|---|---|
| Mar 2026 – Present | Sunna Al Tamyuz | Senior Software Engineer — Integration |
| Oct 2025 – Feb 2026 | Rasid Payment | Team Lead — Backend |
| Sep 2023 – Oct 2025 | Rasid Payments | Senior Backend Engineer |
| Feb 2019 – Apr 2023 | Musafer Inc. | Software Architect & Partner |
| Feb 2017 – 2019 | MAMAW Inc. | Senior Software Engineer & Co-founder |
| 2008 – 2017 | NCTR | Software Engineer / Embedded Systems Engineer |

> Verify against the CV that "Rasid Payment" and "Rasid Payments" are intentionally distinct names.

Each entry: short summary **[CV]** · 3–4 selected contributions **[CV]** · tech tags · links to related case studies. Desktop: two-column (date rail at start, content at end). Mobile: single column with rail.

**Education:** University of Khartoum — degree title and year **[CV]**.
**Professional training:** listed separately from education. Verify the wording of each item; do not present a course as an independently awarded certification unless it is one.

---

## 7. Technical blog

**Categories:** Backend Engineering · Banking Integration · Distributed Systems · Java & Spring Boot · Architecture.

**Suggested first topics** (proposals, not existing articles):

| Category | Title | Covers |
|---|---|---|
| Banking | Designing Reliable Payment Orchestration with Spring Boot | Idempotency, transaction state management, downstream errors, reliable processing |
| Distributed Systems | Kafka Request–Reply in Financial Microservices | Correlation IDs, timeouts, retries, partitioning, async workflows |
| Architecture | Modular Monolith vs Microservices: Practical Design Decisions | Business complexity, team structure, operational cost |
| Java | Building Maintainable Spring Boot Domain Services | Separation of concerns, orchestration, domain logic, infrastructure adapters |

**Article page features:** table of contents (auto from H2/H3), syntax highlighting (Shiki, build-time), diagrams (MDX components), reading time, published/updated dates, canonical URL, category, link to related project, previous/next.

**MDX components:** `<Callout type="note|warning|decision">`, `<Diagram>` (custom SVG), `<CodeTabs>`, `<Figure>`, `<Ltr>` (forces LTR for inline technical strings inside Arabic).

An Arabic article exists only if it is actually translated; the index shows "English only" badges rather than machine translations. Each article sets `hreflang` alternates only for locales that exist.

---

## 8. Interactive terminal

Optional component on the homepage (collapsed by default, §4.4). Not a navigation system.

```
┌ abdalla@portfolio:~ ─────────────────────────────── [ − ] ┐
│ > whoami                                                   │
│ Abdalla Misbah — Senior Software Engineer | Banking        │
│ Integration                                                │
│ > help                                                     │
│ Commands: about, skills, projects, experience, contact,    │
│ github, linkedin, resume, theme, clear, help               │
│ $ Type a command…█                                         │
└────────────────────────────────────────────────────────────┘
  Interactive concept — try skills, projects, or help.
```

**Command registry** (fixed, typed map; output is static data or React nodes):

| Command | Output / action |
|---|---|
| `help` | Lists commands |
| `whoami` | Name and title |
| `about` | 3-line summary + link to /about |
| `skills` | Grouped list: languages, frameworks, messaging, cloud |
| `projects` | Featured projects with links |
| `experience` | Compact timeline |
| `contact` | `aaami1ster@gmail.com` (mailto) + link to /contact |
| `github`, `linkedin`, `resume` | Prints the link (`github.com/aaami1ster`, `linkedin.com/in/abdalla-misbah-7520354a`, CV PDF); opens it **only** after the visitor confirms (e.g. press Enter on "Open? [y/N]") |
| `theme dark\|light` | Switches theme |
| `clear` | Clears output |
| unknown | `command not found: x — type 'help'` |

**Security:** no `eval`, no `new Function`, no dynamic import from input, no network calls from input, no connection to any server shell. Input is matched against registry keys only; arguments are validated against allow-lists. Output never uses `dangerouslySetInnerHTML`.

**UX & accessibility:** native `<input>` with visible label (visually hidden) · output in `role="log"` with `aria-live="polite"` · ↑/↓ history, `Tab` completion, `Ctrl+L` clear · `Esc` moves focus out (no keyboard trap) · terminal content is always `dir="ltr"` · lazy-loaded (`next/dynamic`) so it adds nothing to initial JS.

**Arabic:** release 1 keeps commands in English with localized helper text. Later: Arabic aliases (`مساعدة` → `help`).

---

## 9. Arabic and English

Arabic is part of the architecture from day one, not a translation layer added later.

### 9.1 Routing and document

- `<html lang="en" dir="ltr">` / `<html lang="ar" dir="rtl">` set in `app/[locale]/layout.tsx`.
- UI strings in `messages/en.json` and `messages/ar.json` (next-intl); long-form content in `content/en/**` and `content/ar/**`.
- Translate: headings, navigation, project descriptions, button text, form labels and errors, accessibility labels, metadata, OG text, privacy notice.
- Keep in conventional form: code, technology names, API names, acronyms (IPS/SARIE, SWIFT, CQRS, CI/CD).

### 9.2 Layout

- CSS logical properties only: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`. In Tailwind: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`. Lint against `ml-/mr-/pl-/pr-/left-/right-` in components.
- Mirror navigation order, timeline rail, TOC position, directional icons, carousel/next-previous arrows.
- Do not mirror: code blocks, terminal, diagrams' internal flow, logos, media playback controls, charts with time axes.

### 9.3 Mixed-direction content

- Code, terminal, API endpoints, emails, URLs, phone formats: `dir="ltr"` (and `unicode-bidi: isolate`).
- Inline Latin terms in Arabic prose: wrap in `<bdi>` or `<span dir="ltr">` when adjacent punctuation would reorder (e.g. "IPS/SARIE،"). The `<Ltr>` MDX component does this.
- Never apply `letter-spacing` or uppercase transforms to Arabic text.

### 9.4 Numbers and dates

- Use Western digits (0–9) in both locales for consistency with technical content: `Intl.NumberFormat('ar-u-nu-latn')`. **[TBD]** if Arabic-Indic digits are preferred for Arabic pages.
- **Gotcha:** `ar-SA` defaults to the Islamic (Umm al-Qura) calendar. Format dates with `ar-SA-u-ca-gregory-nu-latn` (or `ar-u-nu-latn`) so timeline dates match the CV. Test with unit tests.

### 9.5 Navigation & meta copy (AR)

About نبذة · Projects المشاريع · Experience الخبرات · Writing المقالات · Contact تواصل · Download CV تحميل السيرة الذاتية · Read case study اقرأ دراسة الحالة · Skip to content انتقل إلى المحتوى

> All Arabic copy in this spec should receive a final native-speaker review for tone before launch.

---

## 10. Contact page

**H1:** Let's connect · **AR:** لنتواصل

> I'm interested in discussing backend engineering, banking integration, software architecture, and meaningful technical collaborations.
>
> Whether you're hiring for a role, exploring a consulting engagement, or would simply like to exchange ideas, feel free to reach out.
>
> I look forward to hearing from you.

Do not imply a formally offered consulting service.

### 10.1 Form

| Field | Rule |
|---|---|
| Name | Required, 2–100 chars |
| Email | Required, valid email, ≤ 254 chars |
| Inquiry type | Required: Job opportunity / Consulting / Collaboration / Other |
| Organization | Optional, ≤ 120 chars |
| Message | Required, 20–5000 chars |
| Consent | Required checkbox: "I've read the privacy notice." (links to /privacy) |
| Honeypot | Hidden field `website`; any value → silently accept and drop |

- Labels always visible (no placeholder-only labels); errors linked via `aria-describedby`, announced, and summarized at top on submit; focus moves to first invalid field.
- States: idle → submitting (button disabled, spinner) → success (inline message, form reset) / error (keeps input, offers mailto fallback).
- Side column: email as accessible `mailto:` link (`aaami1ster@gmail.com`), GitHub (https://github.com/aaami1ster), LinkedIn (https://www.linkedin.com/in/abdalla-misbah-7520354a/), location (city only). **No mobile number** on the public site.

### 10.2 Server handling

- Next.js route handler `app/api/contact/route.ts` (or a Server Action). Same Zod schema validates on client and server.
- Abuse protection: honeypot + minimum fill time (e.g. reject < 3s) + rate limit per IP (e.g. 5 / hour). On Vercel use a shared store (e.g. Upstash Redis free tier); on a VPS, Redis or an in-process limiter.
- Email via Resend (or equivalent). API key in server env vars only; never exposed to the browser. Send to Abdalla's inbox (`CONTACT_TO_EMAIL=aaami1ster@gmail.com`, server env var) with `reply-to` = sender. The sending `from` address must be on a domain verified with the provider, so it cannot be the Gmail address — use `contact@abdallamisbah.com` (verify the domain with the provider). Escape all user content in the email body.
- Data minimization: do not store submissions in a database; do not log message bodies.
- Privacy notice (`/privacy`): what is collected, why, the email provider used as processor, retention, analytics used (prefer cookieless, e.g. self-hosted Umami — MIT), contact for deletion requests.

---

## 11. Technical implementation

### 11.1 Stack

| Concern | Technology | License |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | MIT |
| Styling | Tailwind CSS (v4, CSS-first `@theme` tokens) | MIT |
| Components | shadcn/ui + Radix primitives | MIT |
| Theme switching | next-themes | MIT |
| i18n | next-intl | MIT |
| Content | MDX via Velite (typed collections) | MIT |
| Code highlighting | Shiki + rehype-pretty-code | MIT |
| Fonts | Inter, IBM Plex Sans Arabic, Noto Naskh Arabic, JetBrains Mono via `next/font/google` (self-hosted at build) | OFL 1.1 |
| Icons | Lucide (`lucide-react`) | ISC |
| Animation | Motion | MIT |
| Forms | React Hook Form + Zod | MIT |
| Email | Resend or equivalent (service) | — |
| Hosting | Vercel or containerized VPS | — |
| Testing | Vitest + React Testing Library + Playwright + axe-core | MIT / Apache-2.0 / MPL-2.0 |

No database or CMS for v1. Experience, projects, and article metadata live in typed files / MDX.

### 11.2 Font loading

```ts
// src/lib/fonts.ts
import { Inter, IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic, JetBrains_Mono } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const interFaceOnly = inter.style.fontFamily.split(",")[0].trim(); // Inter without "Inter Fallback"

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"], weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic", display: "swap", preload: false,
});

export const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"], weight: ["400", "700"],
  variable: "--font-naskh", display: "swap", preload: false,
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false,
});
```

In `app/[locale]/layout.tsx`, attach all variables (plus `--font-inter-face`) to `<html>`. `next/font` downloads the files at build time and serves them from the site's own origin — no runtime requests to Google.

### 11.3 Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # <html lang dir>, fonts, ThemeProvider, NextIntlClientProvider
│   │   ├── page.tsx              # Home
│   │   ├── about/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── projects/{page.tsx, [slug]/page.tsx}
│   │   ├── articles/{page.tsx, [slug]/page.tsx}
│   │   ├── contact/page.tsx
│   │   ├── credits/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── opengraph-image.tsx
│   ├── api/contact/route.ts
│   ├── icon.svg
│   ├── global-not-found.tsx  # static bilingual 404 for unmatched URLs
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/      # Navbar, MobileMenu, Footer, LanguageSwitcher, ThemeToggle, SkipLink
│   ├── home/        # Hero, Highlights, AboutPreview, Expertise, SelectedWork, ExperiencePreview, WritingPreview, FinalCta
│   ├── projects/    # ProjectCard, ProjectFilters, CaseStudyLayout
│   ├── diagrams/    # HeroArchitecture, BankingIntegration, PosAggregation, MdmPlatform, SiteArchitecture
│   ├── terminal/    # Terminal (client), commands.ts registry
│   ├── mdx/         # Callout, Diagram, CodeTabs, Figure, Ltr
│   ├── contact/     # ContactForm (client), schema.ts
│   └── ui/          # shadcn/ui components
├── content/
│   ├── en/{projects,articles}/*.mdx
│   └── ar/{projects,articles}/*.mdx
├── data/            # experience.ts, skills.ts, profile.ts (typed, localized)
├── i18n/            # routing.ts, request.ts
├── lib/             # fonts.ts, seo.ts, format.ts (Intl helpers), rate-limit.ts, email.ts
└── proxy.ts         # next-intl locale detection/redirect (Next.js 16 name for middleware)
messages/{en,ar}.json
public/cv/Abdalla_Misbah_CV_en.pdf, Abdalla_Misbah_CV_ar.pdf
docs/{design-spec.md, asset-sources.md}
tests/{unit,e2e}/
```

Server Components by default. Client components only for: terminal, theme toggle, mobile menu, language switcher (if it reads client state), project filters, contact form, diagram animation layer.

### 11.4 Site architecture

```
Visitor / Browser  (Desktop · Mobile · EN / AR)
        │
Next.js application  (SSG for content pages · i18n routing · SEO)
   ├── Content layer  (MDX · projects · experience data · CV PDFs) → pre-rendered, CDN-cached
   └── Contact API    (Zod validation · honeypot · rate limit) → Email provider → Inbox
```

All content pages are statically generated (`generateStaticParams` for both locales and all slugs). Only `/api/contact` runs on the server per request.

### 11.5 SEO and social sharing

- Unique `title` / `description` per page and locale; canonical URLs; `hreflang` alternates `en`, `ar`, `x-default` (→ `/en`).
- `sitemap.ts` with both locales and alternates; `robots.ts`.
- JSON-LD: `ProfilePage` + `Person` (name, jobTitle, address locality, sameAs: `https://github.com/aaami1ster`, `https://www.linkedin.com/in/abdalla-misbah-7520354a/`) on home/about; `BlogPosting` on articles; `BreadcrumbList` on case studies and articles.
- Homepage metadata:
  - **Title:** Abdalla Misbah | Senior Software Engineer & Banking Integration
  - **Description:** Senior Software Engineer in Riyadh with 15+ years of experience in Java, Spring Boot, microservices, banking integration, fintech, and enterprise software architecture.
  - **AR title:** عبدالله مصباح | مهندس برمجيات أول ومتخصص في التكامل المصرفي
  - **AR description:** مهندس برمجيات أول في الرياض بخبرة تزيد على 15 عاماً في Java وSpring Boot والخدمات المصغّرة والتكامل المصرفي والتقنية المالية ومعمارية البرمجيات المؤسسية.
- Open Graph / Twitter: 1200×630, dark navy background, `AM.` monogram, name, title, faint diagram lines. Generated with `next/og` per page (title injected). Note: `next/og` requires TTF/OTF font data (not WOFF2), and its Arabic/RTL shaping is limited — test Arabic OG images; fall back to pre-designed static PNGs for Arabic if rendering is incorrect.

### 11.6 Performance

- Lighthouse ≥ 90 on representative production pages (a synthetic target, not a guarantee).
- Core Web Vitals at p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Budgets: ≤ 100 KB JS (gzip) on the homepage initial load; fonts preloaded ≤ 2 files per locale; hero diagram inline SVG (no image request).
- Terminal, Motion animations, and contact form code are lazy-loaded.

### 11.7 Accessibility (WCAG 2.2 AA)

Semantic landmarks and heading order · skip link · keyboard access for every control · visible focus (`2px solid var(--accent)`, 2px offset) · target size ≥ 24×24px · contrast verified in both themes · accessible form errors · correct `lang`/`dir` on every page and on inline foreign-language spans · reduced-motion support · no information conveyed by color alone · automated axe checks in Playwright for both locales and both themes.

### 11.8 Security

HTTPS only (HSTS) · security headers: CSP (no `unsafe-eval`), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `frame-ancestors 'none'` · contact endpoint: POST only, JSON body size limit (e.g. 10 KB), schema validation, rate limiting, generic error messages · secrets in environment variables only · dependency audit in CI · minimal personal data retention.

### 11.9 Testing

- **Unit (Vitest):** Zod schema, terminal command parser/registry, Intl date/number helpers (incl. Gregorian calendar for `ar`), content loaders.
- **Component (RTL):** theme toggle, language switcher, terminal keyboard behavior, form error states.
- **E2E (Playwright):** each route renders in `en` and `ar` with correct `lang`/`dir`; language switch keeps the page; CV download returns a PDF; contact form happy path (provider mocked) and validation errors; mobile menu focus management; no horizontal scroll at 360px; axe scan with zero serious/critical violations.

---

## 12. Implementation roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| 1. Foundation | Next.js + TS + Tailwind, design tokens, both themes, fonts, next-intl routing (EN/AR, RTL), layout shell (navbar, mobile menu, footer), base UI components | Both locales and both themes render the shell with correct `lang`/`dir`; no theme flash |
| 2. Core portfolio | Home (hero + diagram, highlights, about preview, expertise, experience preview, final CTA), About, Experience, CV download | Home/About/Experience complete in EN + AR with CV-verified content |
| 3. Engineering content | Case-study template, three case studies, sanitized diagrams, projects gallery + filters | Three approved case studies published (`publishApproved: true`) |
| 4. Interactive features | MDX blog, terminal, contact form + API + email, privacy and credits pages | Form delivers email in production-like env; terminal passes security and a11y tests |
| 5. Release | SEO metadata, OG images, sitemap, a11y audit, performance pass, E2E suite, domain + HTTPS | All acceptance criteria (§13) pass on the production domain |

**Content dependencies before launch:** final project descriptions; employer permission for any employer-related details; English and Arabic CV PDFs; professional portrait (optional); final Arabic copy review.

---

## 13. Acceptance criteria

- [ ] Responsive, bilingual (EN/AR) portfolio with dark (default) and light themes; RTL correct on all Arabic pages.
- [ ] Home, About, Experience, Projects, Writing, Contact, Privacy, and Credits pages complete in both languages.
- [ ] At least three fully written, non-confidential case studies with conceptual diagrams.
- [ ] Working contact form with server-side validation, spam protection, rate limiting, and no exposed secrets.
- [ ] Optional terminal with a fixed command registry; no arbitrary execution.
- [ ] Downloadable, current CV (EN; AR if available) and links to professional profiles.
- [ ] Only the approved free/open-source fonts (Inter, IBM Plex Sans Arabic, Noto Naskh Arabic, JetBrains Mono) and icons (Lucide); credits page lists their licenses; no Thmanyah or other licensed assets in the build.
- [ ] SEO metadata, hreflang, sitemap, structured data, and OG images in place.
- [ ] WCAG 2.2 AA checks and automated tests pass for essential visitor flows.
- [ ] Core Web Vitals targets met on representative pages.

---

## 14. Open decisions

| # | Decision | Default until decided |
|---|---|---|
| 1 | ~~Domain name~~ | **Decided: `abdallamisbah.com`.** It is the default `site.url`; `NEXT_PUBLIC_SITE_URL` overrides it for previews |
| 2 | Show availability badge? | Hidden |
| 3 | Professional portrait on About? | Omit |
| 4 | Fourth project (gallery only) | Hidden until content is provided |
| 5 | Arabic-Indic vs Western digits on Arabic pages | Western digits |
| 6 | Hosting: Vercel vs VPS | Vercel (affects rate-limit store) |
| 7 | Analytics | None, or self-hosted Umami (cookieless) |
