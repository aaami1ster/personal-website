import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Monogram } from "./monogram";

export async function Logo() {
  const t = await getTranslations("Brand");

  return (
    <Link
      href="/"
      aria-label={t("homeLabel")}
      className="flex items-center gap-3 rounded-md text-fg"
    >
      <Monogram />
      <span
        aria-hidden="true"
        className="hidden flex-col leading-none sm:flex"
      >
        <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] [:lang(ar)_&]:normal-case [:lang(ar)_&]:tracking-normal">
          {t("name")}
        </span>
        <span className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted [:lang(ar)_&]:normal-case [:lang(ar)_&]:tracking-normal">
          {t("role")}
        </span>
      </span>
    </Link>
  );
}
