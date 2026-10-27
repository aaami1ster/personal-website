import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArticleCard } from "@/components/articles/article-card";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/routing";
import { getArticles } from "@/lib/articles";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Articles");
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale as Locale, "/articles"),
  };
}

// Writing index (design spec §7). One card per slug, newest first; an article
// that exists only in the other locale is listed with an "English only" /
// "Arabic only" badge. Until the first article is published, the page says so
// and shows the engineering philosophy block (§4.9) instead of empty cards.
export default async function ArticlesPage({
  params,
}: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  const t = await getTranslations("Articles");
  const articles = getArticles(locale as Locale);

  return (
    <Container className="max-w-[880px] py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-[65ch] text-muted">{t("intro")}</p>

      {articles.length > 0 ? (
        <ul className="mt-12 grid gap-6">
          {articles.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} locale={locale as Locale} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p className="mt-12 text-muted">{t("empty")}</p>
          <section
            aria-labelledby="philosophy-heading"
            className="mt-6 rounded-xl border border-s-4 border-s-accent bg-surface p-6 md:p-8"
          >
            <h2 id="philosophy-heading" className="text-card font-semibold">
              {t("philosophyHeading")}
            </h2>
            <p className="mt-3 max-w-[65ch] text-muted">{t("philosophyBody")}</p>
          </section>
        </>
      )}
    </Container>
  );
}
