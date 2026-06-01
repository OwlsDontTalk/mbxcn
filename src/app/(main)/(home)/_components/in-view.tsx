"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders its children only once the wrapper scrolls near the viewport. Used to
 * stagger map initialization so the page doesn't boot every WebGL canvas at once.
 */
export function InView({
  children,
  className,
  rootMargin = "200px",
}: {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, shown]);

  return (
    <div ref={ref} className={cn("h-full w-full", className)}>
      {shown ? children : null}
    </div>
  );
}
