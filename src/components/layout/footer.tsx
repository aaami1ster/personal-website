import { getTranslations } from "next-intl/server";
import { Monogram } from "@/components/brand/monogram";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { Container } from "./container";

async function getCopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

const linkClass =
  "rounded-md text-sm text-muted transition-colors hover:text-fg";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = await getCopyrightYear();

  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-fg">
          <Monogram className="h-5" />
          <p className="text-sm text-muted">{t("rights", { year })}</p>
        </div>
        <nav aria-label={t("profiles")}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <li>
              <a href={site.github} rel="me noopener" className={linkClass}>
                {t("github")}
              </a>
            </li>
            <li>
              <a href={site.linkedin} rel="me noopener" className={linkClass}>
                {t("linkedin")}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={linkClass}>
                {t("email")}
              </a>
            </li>
            <li>
              <Link href="/privacy" className={linkClass}>
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/credits" className={linkClass}>
                {t("credits")}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
