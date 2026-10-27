# Projects (source material for case studies)

From Abdalla's CVs and his own E15 write-up. Everything here is Abdalla's
account of his work; publish only after he approves each case study
(`publishApproved: true`, design-spec §5). Employer- or client-related detail
needs that employer's permission. Public background figures about the wider
systems live in `public-context.md` — never present those as his results.

| # | Project | Employer / period | Role | Stack | Case-study priority |
|---|---|---|---|---|---|
| 1 | E15 — National Electronic Government Receipt System (Sudan) | NCTR (confirmed by Abdalla), period within 2008–2017 | Mobile Team Lead + Android/backend developer, led 5 mobile developers | Java, Android, REST, SQL Server, SMS gateway | **Top** — richest story |
| 2 | Digital banking & payment integration | Sunna Al Tamyuz, 2026– | Senior Software Engineer – Integration | Java, Spring Boot, microservices, banking APIs | High (design-spec §5.1 example) |
| 3 | Tanfeeth integration | Sunna Al Tamyuz, 2026– | Middleware integration engineer | Banking middleware, APIs | Medium — public card OK; full case study needs permission |
| 4 | POS Aggregation / SoftPOS platform | Rasid Payments, 2023–2025 | Senior Backend Engineer | Java/Node.js, NestJS, Kafka, Kubernetes, PostgreSQL, Redis | High |
| 5 | MDM for Zain Sudan | Musafer Inc., 2019–2023 | Software Architect & Partner, led 8 engineers | Microservices, Kubernetes, ELK | High |
| 6 | GOAT / Al Qodurat Questions Generator & Bank | — (confirm employer/client) | Led design and development | NestJS, Python, PostgreSQL, n8n, Kubernetes, GPT | Medium — AI angle |
| 7 | ROMOOZ — multi-role e-commerce | MAMAW Inc. era (confirm) | — | NestJS, MongoDB, React | Low |
| 8 | Sadad — high-volume billing for government/commercial sectors | — (confirm which "Sadad" and employer) | — | Node.js, Kafka, Kubernetes | Public card OK; case study on hold until clarified |

**Public project cards (Abdalla, 2026-10-27):** all eight cards on /projects may
be public with CV-level facts only — including Tanfeeth and Sadad. The
`publishApproved` flag gates only full case-study pages.

## 1. E15 — National Electronic Government Receipt System

Public-facing summary (from Abdalla's write-up, interview framing removed):

- **Context:** E15 is Sudan's national electronic government receipt system for the Ministry of Finance, replacing the paper "Form 15" receipt used for payments to government. Government services such as traffic, passports and tariffs issue receipts through it.
- **Role:** Mobile Team Lead and backend/Android developer; led a team of five mobile developers while staying hands-on.
- **Problem:** many target offices, especially rural ones, had unreliable, intermittent or no mobile internet. An internet-only app would fail where it was most needed.
- **Key decision:** separate the business transaction from the transport. Internet (REST) and SMS are two adapters delivering the same logical transaction; the request and response may even travel over different transports.
- **SMS protocol:** a custom compact Java encoding/decoding protocol (service code + operation code + payload fields) because JSON/XML was too large for SMS payloads, and every extra SMS segment added cost, latency and risk of partial delivery.
- **Telecom integration:** an SMS gateway connected to **three telecom operators**; backend message workers decoded payloads, routed them to the right E15 service, and encoded responses back.
- **Reliability:** a stable transaction/correlation ID on every request for idempotency (duplicate or late SMS, transport switching), asynchronous request/response correlation, and end-to-end tracing across Android → operator → gateway → workers → backend.
- **Cost:** optimisation was about communication efficiency — fewer SMS segments, fewer retries, choosing internet when reliable.
- **Coordination:** Ministry of Finance, government agencies, telecom operators, SMS gateway, backend, mobile and infrastructure teams.
- **Lesson:** architecture should reflect the real operating environment rather than assume ideal connectivity.
- **Do not claim:** SMS encryption/signing (only if Abdalla confirms it existed), throughput or volume numbers.

Architecture (conceptual):

```text
Government officer → Android E15 app
   ├─ internet available   → REST API ───────────────┐
   └─ internet unavailable → encoded SMS → operator A/B/C → SMS gateway → message workers ┤
                                                                          E15 backend → central government services
```

## 2–8

Use the CV bullets in `cv.md` for each employer. Case-study structure is in
design-spec §5 (Overview, My Role, Requirements, Architecture, Implementation,
Challenges, Outcome). Where a section has no source material, the spec-writer
must list it as "needs input from Abdalla" instead of inventing it.
