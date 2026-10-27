import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Languages } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/articles/article-meta";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/mdx-content";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import {
  getArticleLocales,
  getArticles,
  getArticleSlugs,
  type Article,
} from "@/lib/articles";
import { existingLanguageAlternates, localePath } from "@/lib/seo";

// The whole page is static output. A slug that was not prerendered is
// rendered before the response is sent (instead of streaming into a fallback
// shell with status 200), so unknown slugs get a real 404 status. Awaiting
// `params` outside <Suspense> is what makes that possible, so the route opts
// out of instant-navigation validation; every real slug is prerendered, so
// navigations to articles still come from static output.
export const ensureStatic = "navigation";
export const instant = false;

// Cache Components need at least one param per dynamic route. With zero
// articles this reserved slug is prerendered, and it always 404s.
const RESERVED_SLUG = "__none__";

// Every slug in both locales: a slug that exists in one locale only is still
// rendered (with a notice) in the other, so the language switcher never 404s.
export function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: RESERVED_SLUG }];
}

/**
 * The article for a page plus its neighbours in the locale's index order
 * (newest first). Prefers the page locale's version and falls back to the
 * other locale's. `null` for unknown and reserved slugs.
 */
function resolveArticle(slug: string, locale: Locale) {
  if (slug === RESERVED_SLUG) return null;
  const list = getArticles(locale);
  const index = list.findIndex((a) => a.slug === slug);
  if (index === -1) return null;
  return {
    article: list[index],
    newer: list[index - 1] as Article | undefined,
    older: list[index + 1] as Article | undefined,
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = resolveArticle(slug, locale as Locale);
  if (!found) notFound();
  const { article } = found;
  const path = `/articles/${slug}`;

  return {
    title: article.title,
    description: article.description,
    // Canonical is the locale the article is written in; hreflang lists only
    // the locales that exist (§7).
    alternates: {
      canonical: localePath(article.locale, path),
      languages: existingLanguageAlternates(path, getArticleLocales(slug)),
    },
  };
}

const bdi = (chunks: ReactNode) => <bdi>{chunks}</bdi>;

export default async function ArticlePage({
  params,
}: PageProps<"/[locale]/articles/[slug]">) {
  const { locale: param, slug } = await params;
  const locale = param as Locale;
  const found = resolveArticle(slug, locale);
  if (!found) notFound();
  const { article, newer, older } = found;

  // Page chrome follows the page locale; everything inside <article> follows
  // the article's own language, which differs for a one-locale article.
  const t = await getTranslations("Articles");
  const tArticle = await getTranslations({
    locale: article.locale,
    namespace: "Articles",
  });
  const tProjects = await getTranslations("Projects");
  const foreign = article.locale !== locale;
  const original = (a: Article) =>
    a.locale === locale ? {} : { lang: a.locale, dir: localeDirection[a.locale] };

  const neighbours = [
    older && { article: older, label: t("previous"), Icon: ArrowLeft, next: false },
    newer && { article: newer, label: t("next"), Icon: ArrowRight, next: true },
  ].filter((n) => !!n);

  return (
    <Container className="py-16 md:py-24">
      {foreign && (
        <p className="mb-10 flex items-center gap-3 rounded-lg border border-s-4 border-s-accent bg-surface px-4 py-3 text-sm">
          <Languages aria-hidden="true" className="size-4 shrink-0 text-accent" />
          {t(`onlyNotice.${article.locale}`)}
        </p>
      )}

      <article lang={article.locale} dir={localeDirection[article.locale]}>
        <header className="max-w-[880px]">
          <p className="inline-block rounded-lg bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {tArticle(`categories.${article.category}`)}
          </p>
          <h1 className="mt-4 text-page font-bold">{article.title}</h1>
          <p className="mt-4 max-w-[65ch] text-lg text-muted">
            {article.description}
          </p>
          <ArticleMeta
            article={article}
            locale={article.locale}
            detailed
            className="mt-6"
          />
        </header>

        <div
          className={
            article.toc.length > 0
              ? "mt-12 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12"
              : "mt-12"
          }
        >
          {article.toc.length > 0 && (
            // First in source order, so it sits on the start side at lg
            // (left in English, right in Arabic) and above the body on mobile.
            <nav
              aria-label={tArticle("toc")}
              className="mb-10 rounded-xl border bg-surface p-5 text-sm lg:sticky lg:top-24 lg:mb-0 lg:self-start lg:border-0 lg:bg-transparent lg:p-0"
            >
              <p className="font-semibold">{tArticle("toc")}</p>
              <ol className="mt-3 space-y-2 border-s ps-4">
                {article.toc.map((entry) => (
                  <li key={entry.url}>
                    <a href={entry.url} className="text-muted hover:text-accent">
                      {entry.title}
                    </a>
                    {entry.items.length > 0 && (
                      <ol className="mt-2 space-y-2 ps-4">
                        {entry.items.map((sub) => (
                          <li key={sub.url}>
                            <a href={sub.url} className="text-muted hover:text-accent">
                              {sub.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="prose-article font-prose text-article">
            <MdxContent code={article.body} locale={article.locale} />
          </div>
        </div>
      </article>

      <footer className="mt-16 max-w-[880px] border-t pt-8">
        {article.relatedProject && (
          <div>
            <p className="text-sm text-muted">{t("relatedProject")}</p>
            {/* Case-study pages don't exist yet, so this opens the gallery. */}
            <Link
              href="/projects"
              className="mt-1 inline-block font-medium text-accent underline-offset-4 hover:underline"
            >
              {tProjects.rich(`items.${article.relatedProject}.title`, { bdi })}
            </Link>
          </div>
        )}

        {neighbours.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {neighbours.map(({ article: n, label, Icon, next }) => (
              <li key={n.slug} className={next ? "sm:col-start-2" : undefined}>
                <Link
                  href={`/articles/${n.slug}`}
                  className={`flex h-full flex-col gap-1 rounded-xl border bg-surface p-4 transition-colors hover:border-accent/60 ${next ? "items-end text-end" : "items-start text-start"}`}
                >
                  <span className="flex items-center gap-2 text-sm text-muted">
                    {!next && <Icon aria-hidden="true" className="size-4 rtl:-scale-x-100" />}
                    {label}
                    {next && <Icon aria-hidden="true" className="size-4 rtl:-scale-x-100" />}
                  </span>
                  <span className="font-medium" {...original(n)}>
                    {n.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/articles"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {t("allArticles")}
        </Link>
      </footer>
    </Container>
  );
}
