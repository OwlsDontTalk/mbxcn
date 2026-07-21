"use client";

import { owl } from "@lucide/lab";
import { Icon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <Icon
            iconNode={owl}
            className="text-muted-foreground/40 size-20"
            strokeWidth={1}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Off the edge of the map
          </h1>
          <p className="text-muted-foreground text-lg">
            Something broke while rendering this page. The owl saw it happen and
            is not talking.
          </p>
          {error.digest ? (
            <p className="text-muted-foreground/70 pt-1 font-mono text-xs">
              digest {error.digest}
            </p>
          ) : null}
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
