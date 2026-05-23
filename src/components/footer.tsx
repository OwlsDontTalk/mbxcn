import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = {
  product: [
    { label: "Documentation", href: "/docs" },
    { label: "Blocks", href: "/blocks" },
  ],
  community: [
    {
      label: "GitHub",
      href: "https://github.com/owlsdonttalk/mbxcn",
      external: true,
    },
  ],
  resources: [
    {
      label: "Mapbox GL JS",
      href: "https://docs.mapbox.com/mapbox-gl-js/",
      external: true,
    },
    { label: "shadcn/ui", href: "https://ui.shadcn.com/", external: true },
    {
      label: "Tailwind CSS",
      href: "https://tailwindcss.com/",
      external: true,
    },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t md:mt-16">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo className="w-fit" />
            <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
              Customizable Mapbox GL components for React. Install via shadcn
              CLI.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Product</h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Community</h3>
            <ul className="space-y-2.5">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
