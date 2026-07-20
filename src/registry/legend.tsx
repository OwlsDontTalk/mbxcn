"use client";

import { cn } from "@/lib/utils";
import type { ChoroplethRamp } from "@/registry/choropleth";

export type LegendProps = {
  /** The same ramp object passed to `<Choropleth>`. */
  ramp: ChoroplethRamp;
  title?: string;
  /** Format numeric bounds. Defaults to a plain string cast. */
  format?: (value: number) => string;
  /** Highlight the band this value falls into, e.g. the hovered feature. */
  activeValue?: number | null;
  className?: string;
};

function bandIndex(ramp: ChoroplethRamp, value: number | null | undefined) {
  if (value === null || value === undefined) return -1;
  if (ramp.kind === "step") {
    return ramp.breaks.filter((brk) => value >= brk).length;
  }
  return -1;
}

export function Legend({
  ramp,
  title,
  format = String,
  activeValue,
  className,
}: LegendProps) {
  const active = bandIndex(ramp, activeValue);

  return (
    <div
      className={cn(
        "bg-background/85 rounded-md border px-3 py-2 backdrop-blur",
        className,
      )}
    >
      {title ? (
        <div className="text-muted-foreground mb-2 text-[10px] tracking-wider uppercase">
          {title}
        </div>
      ) : null}

      {ramp.kind === "step" ? (
        <div className="flex gap-1">
          {ramp.colors.map((color, index) => {
            const from = index === 0 ? null : ramp.breaks[index - 1];
            const to = index < ramp.breaks.length ? ramp.breaks[index] : null;
            return (
              <div key={`${color}-${index}`} className="min-w-10 flex-1">
                <div
                  className="h-3 rounded-sm border transition-transform"
                  style={{
                    background: color,
                    transform: active === index ? "scaleY(1.5)" : undefined,
                  }}
                />
                <div
                  className={cn(
                    "mt-1 text-center text-[10px]",
                    active === index
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {from === null
                    ? `<${format(to as number)}`
                    : to === null
                      ? `${format(from)}+`
                      : `${format(from)}-${format(to)}`}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {ramp.kind === "linear" ? (
        <div>
          <div
            className="h-3 w-full rounded-sm border"
            style={{
              background: `linear-gradient(90deg, ${ramp.stops
                .map(([, color]) => color)
                .join(", ")})`,
            }}
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-[10px]">
            <span>{format(ramp.stops[0][0])}</span>
            <span>{format(ramp.stops[ramp.stops.length - 1][0])}</span>
          </div>
        </div>
      ) : null}

      {ramp.kind === "categorical" ? (
        <div className="flex flex-col gap-1">
          {ramp.values.map(([value, color]) => (
            <div key={String(value)} className="flex items-center gap-2">
              <span
                className="size-3 shrink-0 rounded-sm border"
                style={{ background: color }}
              />
              <span className="text-xs">{String(value)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
