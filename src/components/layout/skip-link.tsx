import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations();

  return (
    <a
      href="#main"
      className="fixed start-4 top-4 z-50 -translate-y-24 rounded-lg bg-cta px-4 py-2 text-sm font-medium text-white transition-transform focus-visible:translate-y-0"
    >
      {t("SkipLink")}
    </a>
  );
}
