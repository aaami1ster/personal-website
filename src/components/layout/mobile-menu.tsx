"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";
import { isActive } from "./nav-links";

type MobileMenuProps = {
  items: NavItem[];
  labels: { open: string; close: string; title: string };
};

// Rendered only while the dialog is open, so reading the pathname never
// happens during prerendering.
function MenuLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "block rounded-lg px-3 py-3 text-lg font-medium text-muted transition-colors hover:bg-surface hover:text-fg",
                active && "bg-surface text-fg",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MobileMenu({ items, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton label={labels.open} className="lg:hidden">
          <Menu className="size-5" />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 end-0 z-50 flex w-[min(20rem,85vw)] flex-col border-s bg-bg p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="ps-2 text-sm font-medium text-muted">
              {labels.title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label={labels.close}>
                <X className="size-5" />
              </IconButton>
            </Dialog.Close>
          </div>
          <nav className="mt-4">
            <MenuLinks items={items} onNavigate={() => setOpen(false)} />
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
