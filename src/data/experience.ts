import type { YearMonth } from "@/lib/format";

// Career data for /experience, the homepage experience preview (§4.8) and the
// terminal. Source of truth: docs/content/cv.md. Titles, periods and English
// bullets are copied from it verbatim (updated-CV wording where the two CVs
// differ); bold figures in the CV are plain text here. Arabic fields are
// translations of the English text. Organization names, course titles,
// providers and tags stay in Latin script in both locales. Strings are plain
// text: pages isolate Latin runs inside Arabic text when rendering (§9.3), so
// the terminal can reuse the same data.

export type { YearMonth };

export type Localized = { en: string; ar: string };

export type Role = {
  id: string;
  organization: Localized;
  /** Short descriptor printed next to the organization, from the CV heading. */
  sector?: Localized;
  title: Localized;
  start: YearMonth;
  end: YearMonth | "present";
  location: Localized;
  highlights: Localized[];
  /** Technologies named in this role's bullets only, at most 6, Latin script. */
  tags: string[];
};

export type Education = {
  id: string;
  institution: Localized;
  degree: Localized;
  year: YearMonth;
  location: Localized;
};

export type Training = {
  id: string;
  title: Localized;
  /** Extra detail from the CV row, shown under the title. */
  detail?: Localized;
  provider: Localized;
  date?: YearMonth;
  kind: "training" | "certification";
};

const riyadh: Localized = { en: "Riyadh, KSA", ar: "الرياض، السعودية" };
const sudan: Localized = { en: "Sudan", ar: "السودان" };

/** Same text in both locales (proper names kept in Latin script). */
const latin = (text: string): Localized => ({ en: text, ar: text });

/** Newest first, as in the CV. */
export const roles: Role[] = [
  {
    id: "sunna-al-tamyuz",
    organization: latin("Sunna Al Tamyuz"),
    sector: { en: "Digital Bank", ar: "بنك رقمي" },
    title: {
      en: "Senior Software Engineer – Integration",
      ar: "مهندس برمجيات أول – التكامل",
    },
    start: { year: 2026, month: 3 },
    end: "present",
    location: riyadh,
    highlights: [
      {
        en: "Part of the middleware/backend integration team building a modern digital-banking platform for the Saudi market, responsible for integration between digital channels, core banking, payment systems, and domain platforms.",
        ar: "العمل ضمن فريق تكامل البرمجيات الوسيطة والأنظمة الخلفية الذي يبني منصة مصرفية رقمية حديثة للسوق السعودية، والمسؤول عن التكامل بين القنوات الرقمية والنظام المصرفي الأساسي وأنظمة المدفوعات والمنصات المصرفية المتخصصة.",
      },
      {
        en: "Designed and implemented payment and transfer integrations with the Core Banking System (CBS) and Payment Service Hub (PSH) across internal transfers, local payments (IPS/SARIE), international SWIFT transfers, GCC transfers, Host-to-Host services, and Money Transfer Operator (MTO) flows.",
        ar: "تصميم وتنفيذ تكاملات المدفوعات والتحويلات مع النظام المصرفي الأساسي (CBS) ومركز خدمات المدفوعات (PSH)، وتشمل التحويلات الداخلية والمدفوعات المحلية (IPS/SARIE) والتحويلات الدولية عبر SWIFT وتحويلات دول الخليج (GCC) وخدمات Host-to-Host وتدفقات شركات تحويل الأموال (MTO).",
      },
      {
        en: "Owned middleware integration activities across banking domain systems including LMS, FMS, and BMS: API contract review, field mapping, orchestration, validation, error handling, testing, deployment support, and production-readiness troubleshooting.",
        ar: "تولّي أنشطة تكامل البرمجيات الوسيطة عبر الأنظمة المصرفية المتخصصة ومنها LMS وFMS وBMS: مراجعة عقود API، ومطابقة الحقول، وتنسيق التدفقات، والتحقق من صحة البيانات، ومعالجة الأخطاء، والاختبار، ودعم النشر، وتشخيص المشكلات وحلّها لضمان الجاهزية للتشغيل الفعلي.",
      },
      {
        en: "Contributed to the Tanfeeth project as a middleware integration engineer, integrating Tanfeeth services with bank systems and coordinating end-to-end API flows between external channels and internal banking platforms.",
        ar: "المساهمة في مشروع Tanfeeth بدور مهندس تكامل للبرمجيات الوسيطة، من خلال دمج خدمات Tanfeeth مع أنظمة البنك وتنسيق تدفقات API من البداية إلى النهاية بين القنوات الخارجية والمنصات المصرفية الداخلية.",
      },
      {
        en: "Collaborated with product, core-banking, payment, security, DevOps, and external vendor teams to resolve interface gaps, clarify mandatory/optional fields, align downstream contracts, and support delivery across development and test environments.",
        ar: "التعاون مع فرق المنتج والنظام المصرفي الأساسي والمدفوعات والأمن وDevOps والموردين الخارجيين لسدّ الفجوات في الواجهات، وتوضيح الحقول الإلزامية والاختيارية، ومواءمة العقود مع الأنظمة اللاحقة، ودعم التسليم في بيئات التطوير والاختبار.",
      },
      {
        en: "Applied microservices and API-integration practices to improve maintainability, resiliency, traceability, and consistency of banking integration services.",
        ar: "تطبيق ممارسات الخدمات المصغّرة وتكامل API لتحسين قابلية الصيانة والمرونة وقابلية التتبّع والاتساق في خدمات التكامل المصرفي.",
      },
    ],
    tags: ["Middleware", "API integration", "Microservices", "IPS/SARIE", "SWIFT"],
  },
  {
    id: "rasid-payment",
    organization: latin("Rasid Payment"),
    title: { en: "Team Lead – Backend", ar: "قائد فريق – الأنظمة الخلفية" },
    start: { year: 2025, month: 10 },
    end: { year: 2026, month: 2 },
    location: riyadh,
    highlights: [
      {
        en: "Led a team of 6 backend engineers delivering high-availability Node.js services for financial and telecom systems.",
        ar: "قيادة فريق من 6 مهندسي أنظمة خلفية يقدّم خدمات Node.js عالية التوافر للأنظمة المالية وأنظمة الاتصالات.",
      },
      {
        en: "Designed and evolved a microservices architecture using event-driven patterns and Kafka to decouple services and improve scalability under peak load.",
        ar: "تصميم معمارية خدمات مصغّرة وتطويرها باستخدام الأنماط القائمة على الأحداث وKafka لفصل الخدمات عن بعضها وتحسين قابلية التوسّع تحت أحمال الذروة.",
      },
      {
        en: "Led integrations with external payment and telecom gateways and oversaw CI/CD, Kubernetes deployments, engineering standards, code review, and delivery coordination.",
        ar: "قيادة التكامل مع بوابات الدفع والاتصالات الخارجية، والإشراف على CI/CD وعمليات النشر على Kubernetes والمعايير الهندسية ومراجعة الشيفرة وتنسيق التسليم.",
      },
    ],
    tags: ["Node.js", "Microservices", "Kafka", "Kubernetes", "CI/CD"],
  },
  {
    id: "rasid-payments",
    organization: latin("Rasid Payments"),
    title: { en: "Senior Backend Engineer", ar: "مهندس أنظمة خلفية أول" },
    start: { year: 2023, month: 9 },
    end: { year: 2025, month: 10 },
    location: riyadh,
    highlights: [
      {
        en: "Engineered backend services for a SoftPOS and payment aggregation platform using Node.js, NestJS, REST/GraphQL APIs, PostgreSQL, Redis, Kafka, and containerized deployment.",
        ar: "هندسة خدمات خلفية لمنصة SoftPOS وتجميع المدفوعات باستخدام Node.js وNestJS وواجهات REST/GraphQL وPostgreSQL وRedis وKafka والنشر عبر الحاويات.",
      },
      {
        en: "Built integrations for payment, billing, transaction processing, reconciliation, and external financial services, with focus on reliability, idempotency, retries, monitoring, and operational support.",
        ar: "بناء تكاملات للمدفوعات والفوترة ومعالجة المعاملات والتسوية والخدمات المالية الخارجية، مع التركيز على الموثوقية وعدم تكرار أثر الطلبات المعادة (idempotency) وإعادة المحاولة والمراقبة والدعم التشغيلي.",
      },
      {
        en: "Automated delivery workflows with GitLab CI/CD and Docker; contributed to monitoring and production troubleshooting using Prometheus/Grafana and structured logging.",
        ar: "أتمتة مسارات التسليم باستخدام GitLab CI/CD وDocker؛ والمساهمة في المراقبة وتشخيص أعطال بيئة الإنتاج باستخدام Prometheus/Grafana والسجلات المهيكلة.",
      },
    ],
    tags: ["Node.js", "NestJS", "GraphQL", "PostgreSQL", "Kafka", "Docker"],
  },
  {
    id: "musafer",
    organization: latin("Musafer Inc."),
    title: {
      en: "Software Architect & Partner",
      ar: "مهندس معماري للبرمجيات وشريك",
    },
    start: { year: 2019, month: 2 },
    end: { year: 2023, month: 4 },
    location: sudan,
    highlights: [
      {
        en: "Designed and delivered a Master Data Management platform for Zain Telecom using microservices and Kubernetes, supporting large-scale subscriber data processing.",
        ar: "تصميم وتسليم منصة لإدارة البيانات الرئيسية لصالح Zain Telecom باستخدام الخدمات المصغّرة وKubernetes، لدعم معالجة بيانات المشتركين على نطاق واسع.",
      },
      {
        en: "Led an 8-person backend team, introduced CI/CD practices, reviewed architecture and code, and mentored engineers on Java, microservices, and system design.",
        ar: "قيادة فريق أنظمة خلفية من 8 أشخاص، وإدخال ممارسات CI/CD، ومراجعة المعمارية والشيفرة، وتوجيه المهندسين في Java والخدمات المصغّرة وتصميم الأنظمة.",
      },
    ],
    tags: ["Microservices", "Kubernetes", "Java", "CI/CD"],
  },
  {
    id: "mamaw",
    organization: latin("MAMAW Inc."),
    title: {
      en: "Senior Software Engineer & Co-founder",
      ar: "مهندس برمجيات أول وشريك مؤسس",
    },
    start: { year: 2017, month: 2 },
    end: { year: 2019 },
    location: sudan,
    highlights: [
      {
        en: "Built modular ERP and e-commerce platforms using Java and Node.js microservices, including core backend services, integrations, and deployment automation.",
        ar: "بناء منصات ERP وتجارة إلكترونية معيارية باستخدام خدمات مصغّرة بلغة Java وبيئة Node.js، بما في ذلك الخدمات الخلفية الأساسية والتكاملات وأتمتة النشر.",
      },
    ],
    tags: ["Java", "Node.js", "Microservices"],
  },
  {
    id: "nctr",
    organization: latin("NCTR"),
    title: {
      en: "Software Engineer / Embedded Systems Engineer",
      ar: "مهندس برمجيات / مهندس أنظمة مدمجة",
    },
    start: { year: 2008 },
    end: { year: 2017 },
    location: sudan,
    highlights: [
      {
        en: "Contributed to national-scale government payment and information systems, developing secure financial and embedded software using Java, C++, REST services, and relational databases.",
        ar: "المساهمة في أنظمة حكومية للمدفوعات والمعلومات على المستوى الوطني، وتطوير برمجيات مالية ومدمجة آمنة باستخدام Java وC++ وخدمات REST وقواعد البيانات العلائقية.",
      },
      {
        en: "Provided technical leadership and mentoring while supporting high-availability payment-processing components and enterprise integrations.",
        ar: "تقديم القيادة التقنية والتوجيه إلى جانب دعم مكوّنات معالجة المدفوعات عالية التوافر وتكاملات الأنظمة المؤسسية.",
      },
    ],
    tags: ["Java", "C++", "REST"],
  },
];

// Education shows the university, degree (with honours), year and location;
// the specialization and final project in cv.md are not shown on the site.
export const education: Education[] = [
  {
    id: "university-of-khartoum",
    institution: { en: "University of Khartoum", ar: "جامعة الخرطوم" },
    degree: {
      en: "B.Sc. Electrical & Electronics Engineering (1st Class Honours)",
      ar: "بكالوريوس الهندسة الكهربائية والإلكترونية (مرتبة الشرف الأولى)",
    },
    year: { year: 2007 },
    location: sudan,
  },
];

// All rows of docs/content/cv.md §Certifications & training. Every row is
// "training": a row only becomes "certification" once cv.md marks it as a
// confirmed, independently awarded certification (design spec §6.2).
export const training: Training[] = [
  {
    id: "udemy-agentic-ai",
    title: latin("AI Engineer Agentic Track: The Complete Agent & MCP Course"),
    detail: {
      en: "8 projects with OpenAI Agents SDK, CrewAI, LangGraph, AutoGen, MCP",
      ar: "8 مشاريع باستخدام OpenAI Agents SDK وCrewAI وLangGraph وAutoGen وMCP",
    },
    provider: latin("Udemy"),
    date: { year: 2026, month: 8 },
    kind: "training",
  },
  {
    id: "oracle-java-design-patterns",
    title: latin("Java Design Patterns, Ed 1"),
    provider: latin("Oracle University"),
    kind: "training",
  },
  {
    id: "koenig-java-performance-tuning",
    title: latin("Java Performance Tuning"),
    provider: latin("Koenig"),
    kind: "training",
  },
  {
    id: "exin-itil-foundation",
    title: latin("ITIL® Foundation in ITSM"),
    provider: latin("EXIN"),
    kind: "training",
  },
  {
    id: "bptc-pmp",
    title: latin("Project Management Professional (PMP)"),
    provider: latin("BPTC"),
    kind: "training",
  },
  {
    id: "gnhsoft-linux-device-drivers",
    title: latin("Linux Device Drivers"),
    provider: latin("GNHSoft"),
    kind: "training",
  },
];
