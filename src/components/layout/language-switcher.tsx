"use client";

import { useLocale } from "next-intl";
import { Suspense, type ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type SwitcherLinkProps = Omit<ComponentProps<typeof Link>, "href">;

function CurrentPageLink(props: SwitcherLinkProps) {
  return <Link href={usePathname()} {...props} />;
}

export function LanguageSwitcher({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const target: Locale = useLocale() === "ar" ? "en" : "ar";
  const props: SwitcherLinkProps = {
    locale: target,
    hrefLang: target,
    lang: target,
    "aria-label": label,
    className:
      "inline-flex h-10 items-center rounded-lg px-3 text-[0.9375rem] font-medium text-muted transition-colors hover:bg-surface hover:text-fg",
    children: text,
  };

  // Until the current path is known, link to the other locale's home page.
  return (
    <Suspense fallback={<Link href="/" {...props} />}>
      <CurrentPageLink {...props} />
    </Suspense>
  );
}
