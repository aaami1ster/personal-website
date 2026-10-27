import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

const OFL = { name: "SIL Open Font License 1.1", url: "https://openfontlicense.org" };

const fonts = [
  { name: "Inter", usage: "usageInter", url: "https://rsms.me/inter/", license: OFL },
  { name: "IBM Plex Sans Arabic", usage: "usagePlex", url: "https://github.com/IBM/plex", license: OFL },
  { name: "Noto Naskh Arabic", usage: "usageNaskh", url: "https://notofonts.github.io/arabic/", license: OFL },
  { name: "JetBrains Mono", usage: "usageMono", url: "https://www.jetbrains.com/lp/mono/", license: OFL },
] as const;

const icons = [
  {
    name: "Lucide",
    usage: "usageLucide",
    url: "https://lucide.dev",
    license: { name: "ISC", url: "https://lucide.dev/license" },
  },
] as const;

const libraries = [
  { name: "Next.js", url: "https://github.com/vercel/next.js", license: "MIT" },
  { name: "React", url: "https://github.com/facebook/react", license: "MIT" },
  { name: "Tailwind CSS", url: "https://github.com/tailwindlabs/tailwindcss", license: "MIT" },
  { name: "next-intl", url: "https://github.com/amannn/next-intl", license: "MIT" },
  { name: "next-themes", url: "https://github.com/pacocoursey/next-themes", license: "MIT" },
  { name: "Radix UI", url: "https://github.com/radix-ui/primitives", license: "MIT" },
  { name: "Zod", url: "https://github.com/colinhacks/zod", license: "MIT" },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/credits">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Credits");
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/credits"),
  };
}

const cell = "border-b px-4 py-3 text-start align-top";
const link = "text-accent underline-offset-4 hover:underline";

export default async function CreditsPage() {
  const t = await getTranslations("Credits");

  const assetTable = (
    rows: ReadonlyArray<{
      name: string;
      usage: string;
      url: string;
      license: { name: string; url: string };
    }>,
  ) => (
    <div className="mt-4 overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead className="text-muted">
          <tr>
            <th scope="col" className={cell}>{t("name")}</th>
            <th scope="col" className={cell}>{t("usage")}</th>
            <th scope="col" className={cell}>{t("license")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="last:[&>td]:border-b-0">
              <td className={cell}>
                <a href={row.url} className={link} dir="ltr">{row.name}</a>
              </td>
              <td className={cell}>{t(row.usage)}</td>
              <td className={cell}>
                <a href={row.license.url} className={link} dir="ltr">{row.license.name}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Container className="max-w-[880px] py-20 md:py-28">
      <h1 className="text-page font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-[65ch] text-muted">{t("intro")}</p>

      <section className="mt-12">
        <h2 className="text-card font-semibold">{t("fonts")}</h2>
        {assetTable(fonts)}
      </section>

      <section className="mt-12">
        <h2 className="text-card font-semibold">{t("icons")}</h2>
        {assetTable(icons)}
      </section>

      <section className="mt-12">
        <h2 className="text-card font-semibold">{t("libraries")}</h2>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {libraries.map((lib) => (
            <li key={lib.name} className="flex justify-between gap-4 rounded-lg border bg-surface px-4 py-3">
              <a href={lib.url} className={link} dir="ltr">{lib.name}</a>
              <span className="text-muted" dir="ltr">{lib.license}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm text-muted">{t("original")}</p>
    </Container>
  );
}
