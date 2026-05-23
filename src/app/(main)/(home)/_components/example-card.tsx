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
