import Link from "next/link";
import { Icon } from "lucide-react";
import { owl } from "@lucide/lab";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  onClick?: () => void;
  isLink?: boolean;
}

export function Logo({ className, onClick, isLink = true }: LogoProps) {
  const logoClasses =
    "inline-flex items-center gap-2 text-base leading-none font-bold transition-colors";

  return isLink ? (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        logoClasses,
        "h-9 hover:text-blue-600 dark:hover:text-blue-300",
        className,
      )}
    >
      <Icon iconNode={owl} className="size-9" />
      mapboxcn
    </Link>
  ) : (
    <div className={cn(logoClasses, className)}>
      <Icon iconNode={owl} className="size-9" />
      mapboxcn
    </div>
  );
}
