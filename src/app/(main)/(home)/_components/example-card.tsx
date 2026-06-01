import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function ExampleCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("bg-card relative overflow-hidden rounded-xl border", className)}>
      {children}
    </div>
  );
}

export function PlaceholderCard({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted/20 text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-center",
        className,
      )}
    >
      <Icon className="size-6 opacity-60" />
      <div className="text-foreground/80 text-sm font-medium">{label}</div>
      <div className="text-[11px] tracking-wide uppercase opacity-70">
        Coming soon
      </div>
    </div>
  );
}
