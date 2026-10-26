import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { Container } from "./container";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { navItems } from "./nav-items";
import { NavLinks } from "./nav-links";
import { ScrollAwareHeader } from "./scroll-aware-header";
import { ThemeToggle } from "./theme-toggle";

export async function Navbar() {
  const t = await getTranslations();
  const items = navItems.map((item) => ({
    href: item.href,
    label: t(`Nav.${item.key}`),
  }));

  return (
    <ScrollAwareHeader>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-1">
          <nav aria-label={t("Nav.label")} className="hidden lg:block">
            <NavLinks items={items} />
          </nav>
          <span aria-hidden="true" className="mx-2 hidden h-5 w-px bg-border lg:block" />
          <ThemeToggle label={t("Theme.toggle")} />
          <LanguageSwitcher
            text={t("Language.switchTo")}
            label={t("Language.switchToLabel")}
          />
          <MobileMenu
            items={items}
            labels={{
              open: t("Nav.openMenu"),
              close: t("Nav.closeMenu"),
              title: t("Nav.menuTitle"),
            }}
          />
        </div>
      </Container>
    </ScrollAwareHeader>
  );
}
