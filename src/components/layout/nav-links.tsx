"use client";

import { Suspense } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkClass = cn(
  "relative rounded-md px-3 py-2 text-[0.9375rem] font-medium text-muted transition-colors hover:text-fg",
  "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:opacity-0 after:transition-opacity",
  "aria-[current=page]:text-fg aria-[current=page]:after:opacity-100",
);

function ActiveNavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  return (
    <Link
      href={item.href}
      aria-current={isActive(pathname, item.href) ? "page" : undefined}
      className={linkClass}
    >
      {item.label}
    </Link>
  );
}

// The pathname is request data on routes with dynamic params, so the active
// state streams in; the fallback is the same link without the indicator.
export function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => (
        <li key={item.href}>
          <Suspense
            fallback={
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            }
          >
            <ActiveNavLink item={item} />
          </Suspense>
        </li>
      ))}
    </ul>
  );
}
