export const navItems = [
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "experience", href: "/experience" },
  { key: "articles", href: "/articles" },
  { key: "contact", href: "/contact" },
] as const;

export type NavItem = { href: string; label: string };
