import { BookOpen, CornerDownRight, LucideIcon } from "lucide-react";

export interface MainNavItem {
  href: string;
  label: string;
}

export interface SiteNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  new?: boolean;
}

export interface SiteNavigationGroup {
  title: string;
  items: SiteNavigationItem[];
}

export const docsNavigation: SiteNavigationGroup[] = [
  {
    title: "Basics",
    items: [{ title: "Getting Started", href: "/docs", icon: BookOpen }],
  },
];

const navItems: SiteNavigationItem[] = [
  { title: "Home", href: "/", icon: CornerDownRight },
  { title: "Docs", href: "/docs", icon: CornerDownRight },
  { title: "Blocks", href: "/blocks", icon: CornerDownRight },
];

export const siteNavigation: SiteNavigationGroup[] = [
  {
    title: "Pages",
    items: navItems,
  },
  ...docsNavigation,
];
