import {
  BookOpen,
  Boxes,
  CornerDownRight,
  LucideIcon,
  Map,
  MapPin,
  MessageSquare,
  SlidersHorizontal,
} from "lucide-react";

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
  {
    title: "Components",
    items: [
      { title: "Map", href: "/docs/map", icon: Map },
      { title: "Marker", href: "/docs/marker", icon: MapPin },
      { title: "Popup", href: "/docs/popup", icon: MessageSquare },
      { title: "Controls", href: "/docs/controls", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Guides",
    items: [{ title: "3D", href: "/docs/3d", icon: Boxes, new: true }],
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
