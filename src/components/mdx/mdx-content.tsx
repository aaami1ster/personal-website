import type { ComponentProps, ComponentType, ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Callout } from "./callout";
import { Diagram } from "./diagram";
import { Ltr } from "./ltr";

type MdxComponents = Record<string, ComponentType<never>>;

// Code blocks are highlighted by Shiki at build time (velite.config.ts). They
// always run left to right, in the mono face, even inside Arabic articles.
function Pre({ className, ...props }: ComponentProps<"pre">) {
  return <pre dir="ltr" className={cn("font-mono", className)} {...props} />;
}

function componentsFor(locale: Locale): MdxComponents {
  return {
    pre: Pre,
    Callout: (props: { type?: string; children?: ReactNode }) => (
      <Callout {...props} locale={locale} />
    ),
    Diagram,
    Ltr,
  };
}

// Built once per locale at module level, so component identities are stable.
const components: Record<Locale, MdxComponents> = {
  en: componentsFor("en"),
  ar: componentsFor("ar"),
};

/**
 * Evaluates a Velite-compiled MDX body (a function body that imports nothing
 * but the JSX runtime). Server Component only: it runs during prerender, so
 * neither the code string nor `new Function` reaches the browser.
 */
export function MdxContent({ code, locale }: { code: string; locale: Locale }) {
  const mdx = new Function(code)({ ...runtime }) as {
    default: (props: { components: MdxComponents }) => ReactNode;
  };
  return mdx.default({ components: components[locale] });
}
