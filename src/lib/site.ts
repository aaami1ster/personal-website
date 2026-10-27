import type { Locale } from "@/i18n/routing";

export const site = {
  name: "Abdalla Misbah",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdallamisbah.com",
  email: "aaami1ster@gmail.com",
  github: "https://github.com/aaami1ster",
  linkedin: "https://www.linkedin.com/in/abdalla-misbah-7520354a/",
} as const;

/**
 * Downloadable CV PDFs, shown as a "Download PDF" link on /cv. Add an entry
 * only for a phone-free PDF that is committed to `public/cv/` with the file
 * names from design spec §4.2: `/cv/Abdalla_Misbah_CV_en.pdf` or
 * `/cv/Abdalla_Misbah_CV_ar.pdf`, e.g.
 * `en: { href: "/cv/Abdalla_Misbah_CV_en.pdf", sizeKb: 180 }`.
 * Empty until such files exist; /cv is printable without them.
 */
export const cvPdf: Partial<Record<Locale, { href: string; sizeKb: number }>> = {};
