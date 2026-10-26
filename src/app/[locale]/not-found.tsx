import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <Container className="py-32">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-page font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-[60ch] text-muted">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-lg bg-cta px-5 font-medium text-white transition-colors hover:bg-cta-hover"
      >
        {t("home")}
      </Link>
    </Container>
  );
}
