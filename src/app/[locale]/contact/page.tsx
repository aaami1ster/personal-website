import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm, type ContactFormLabels } from "@/components/contact/contact-form";
import { inquiryTypes, contactErrorKeys } from "@/components/contact/schema";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

// Contact page (design spec §10). Prerendered: it reads no request data and no
// env vars, so whether the email provider is configured is decided by
// POST /api/contact at request time, not baked in at build. No phone number
// on the public site (§10.1).

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Contact");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/contact"),
  };
}

const intro = ["intro1", "intro2", "intro3"] as const;

const link = "text-accent underline-offset-4 hover:underline";

/** Display form of a profile URL, e.g. "github.com/aaami1ster". */
const displayUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  const labels: ContactFormLabels = {
    fields: {
      name: t("fields.name"),
      email: t("fields.email"),
      inquiry: t("fields.inquiry"),
      inquiryPlaceholder: t("fields.inquiryPlaceholder"),
      organization: t("fields.organization"),
      message: t("fields.message"),
      website: t("fields.website"),
    },
    inquiry: Object.fromEntries(
      inquiryTypes.map((type) => [type, t(`inquiry.${type}`)]),
    ) as ContactFormLabels["inquiry"],
    consent: t.rich("consent", {
      link: (chunks) => (
        <Link href="/privacy" className={`${link} underline`}>
          {chunks}
        </Link>
      ),
    }),
    submit: t("submit"),
    submitting: t("submitting"),
    errorSummary: t("errorSummary"),
    errors: Object.fromEntries(
      contactErrorKeys.map((key) => [key, t(`errors.${key}`)]),
    ) as ContactFormLabels["errors"],
    success: t("success"),
    unavailable: t("unavailable"),
    openEmail: t("openEmail"),
    rateLimited: t("rateLimited"),
    failed: t("failed"),
  };

  const contacts = [
    { label: t("aside.email"), href: `mailto:${site.email}`, text: site.email },
    { label: t("aside.github"), href: site.github, text: displayUrl(site.github), rel: "me noopener" },
    { label: t("aside.linkedin"), href: site.linkedin, text: displayUrl(site.linkedin), rel: "me noopener" },
  ];

  return (
    <Container className="py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <div className="max-w-[65ch] text-muted">
        {intro.map((key) => (
          <p key={key} className="mt-6">
            {t(key)}
          </p>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <ContactForm labels={labels} />

        <aside aria-labelledby="contact-aside-heading">
          <div className="rounded-xl border bg-surface p-6">
            <h2 id="contact-aside-heading" className="text-card font-semibold">
              {t("aside.heading")}
            </h2>
            <dl className="mt-4 grid gap-4 text-sm">
              {contacts.map((item) => (
                <div key={item.href}>
                  <dt className="text-muted">{item.label}</dt>
                  <dd className="mt-1">
                    <a href={item.href} rel={item.rel} className={`${link} break-all`} dir="ltr">
                      {item.text}
                    </a>
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-muted">{t("aside.location")}</dt>
                <dd className="mt-1">{t("aside.city")}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </Container>
  );
}
