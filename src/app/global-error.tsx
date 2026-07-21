"use client";

import { owl } from "@lucide/lab";
import { Icon } from "lucide-react";
import { useEffect } from "react";

import "@/styles/globals.css";

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
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
                mapboxcn hit a wall
              </h1>
              <p className="text-muted-foreground text-lg">
                The app failed to start rendering. Reloading usually clears it.
              </p>
              {error.digest ? (
                <p className="text-muted-foreground/70 pt-1 font-mono text-xs">
                  digest {error.digest}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={reset}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
