"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/icon-button";

// Both icons are rendered and CSS shows the right one for the active theme,
// so the server markup never depends on the visitor's stored preference.
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <IconButton
      label={label}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <Sun className="size-[1.125rem] [[data-theme=light]_&]:hidden" />
      <Moon className="hidden size-[1.125rem] [[data-theme=light]_&]:block" />
    </IconButton>
  );
}
