"use client";

import type {
  ExpressionSpecification,
  GeoJSONSourceSpecification,
  GeoJSONFeature,
  MapMouseEvent,
} from "mapbox-gl";
import { useEffect, useRef } from "react";

import { Layer } from "@/registry/layer";
import { useMap } from "@/registry/map";

/**
 * A colour scale. Pass the same object to `<Choropleth>` and `<Legend>` so the
 * swatches can never drift from the paint expression.
 */
export type ChoroplethRamp =
  | { kind: "step"; breaks: number[]; colors: string[] }
  | { kind: "linear"; stops: [number, string][] }
  | {
      kind: "categorical";
      values: [string | number, string][];
      fallback?: string;
    };

/** Build the Mapbox colour expression a ramp describes. */
export function rampExpression(
  ramp: ChoroplethRamp,
  value: ExpressionSpecification,
): ExpressionSpecification {
  if (ramp.kind === "step") {
    const tail = ramp.breaks.flatMap((brk, index) => [
      brk,
      ramp.colors[index + 1],
    ]);
    return ["step", value, ramp.colors[0], ...tail] as ExpressionSpecification;
  }

  if (ramp.kind === "linear") {
    const stops = ramp.stops.flat();
    return [
      "interpolate",
      ["linear"],
      value,
      ...stops,
    ] as ExpressionSpecification;
  }

  return [
    "match",
    value,
    ...ramp.values.flat(),
    ramp.fallback ?? "#cbd5e1",
  ] as ExpressionSpecification;
}

type Outline = { color?: string; width?: number };

export type ChoroplethProps = {
  /** Unique id. Names the source and the layers derived from it. */
  id: string;
  /** GeoJSON object or a URL. */
  data: GeoJSONSourceSpecification["data"];
  /** Property name to colour by, or a full expression. */
  value: string | ExpressionSpecification;
  /** Colour scale. Share this object with `<Legend>`. */
  ramp: ChoroplethRamp;
  /**
   * Feature property holding a stable id. Required for hover highlighting -
   * `feature-state` needs an id, and GeoJSON features rarely carry one.
   */
  featureId?: string;
  /** Fill opacity. Defaults to 0.75. */
  opacity?: number;
  /** Draw a border between features. Defaults to a hairline. */
  outline?: boolean | Outline;
  /** Highlight the feature under the cursor. Requires `featureId`. */
  hover?: boolean;
  onHover?: (feature: GeoJSONFeature | null, event: MapMouseEvent) => void;
  onSelect?: (feature: GeoJSONFeature, event: MapMouseEvent) => void;
  beforeId?: string;
};

export function Choropleth({
  id,
  data,
  value,
  ramp,
  featureId,
  opacity = 0.75,
  outline = true,
  hover = true,
  onHover,
  onSelect,
  beforeId,
}: ChoroplethProps) {
  const { map } = useMap();
  const hoveredRef = useRef<string | number | null>(null);
  const handlers = useRef({ onHover, onSelect });
  const border: Outline = typeof outline === "object" ? outline : {};
  const hoverable = hover && !!featureId;

  useEffect(() => {
    handlers.current = { onHover, onSelect };
  });

  useEffect(() => {
    if (!map) return;

    const clear = () => {
      if (hoveredRef.current === null) return;
      map.setFeatureState(
        { source: id, id: hoveredRef.current },
        { hover: false },
      );
      hoveredRef.current = null;
    };

    const move = (event: MapMouseEvent & { features?: GeoJSONFeature[] }) => {
      const feature = event.features?.[0];
      if (!feature) return;
      map.getCanvas().style.cursor = "pointer";

      if (hoverable && feature.id !== hoveredRef.current) {
        clear();
        hoveredRef.current = feature.id ?? null;
        if (hoveredRef.current !== null) {
          map.setFeatureState(
            { source: id, id: hoveredRef.current },
            { hover: true },
          );
        }
      }

      handlers.current.onHover?.(feature, event);
    };

    const leave = (event: MapMouseEvent) => {
      map.getCanvas().style.cursor = "";
      clear();
      handlers.current.onHover?.(null, event);
    };

    const click = (
      event: MapMouseEvent & { features?: GeoJSONFeature[] },
    ) => {
      const feature = event.features?.[0];
      if (feature) handlers.current.onSelect?.(feature, event);
    };

    map.on("mousemove", id, move);
    map.on("mouseleave", id, leave);
    map.on("click", id, click);

    return () => {
      map.off("mousemove", id, move);
      map.off("mouseleave", id, leave);
      map.off("click", id, click);
      // The style may already be gone during teardown.
      try {
        clear();
      } catch {
        hoveredRef.current = null;
      }
    };
  }, [map, id, hoverable]);

  const valueExpression: ExpressionSpecification =
    typeof value === "string" ? ["get", value] : value;
  const color = rampExpression(ramp, valueExpression);

  const fillOpacity: ExpressionSpecification | number = hoverable
    ? [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        Math.min(1, opacity + 0.2),
        opacity,
      ]
    : opacity;

  return (
    <>
      <Layer
        id={id}
        type="fill"
        data={data}
        sourceOptions={featureId ? { promoteId: featureId } : undefined}
        beforeId={beforeId}
        paint={{ "fill-color": color, "fill-opacity": fillOpacity }}
      />
      {outline !== false ? (
        <Layer
          id={`${id}-outline`}
          type="line"
          source={id}
          paint={{
            "line-color": border.color ?? "#ffffff",
            "line-width": hoverable
              ? [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  (border.width ?? 0.7) + 1.3,
                  border.width ?? 0.7,
                ]
              : (border.width ?? 0.7),
            "line-opacity": 0.9,
          }}
        />
      ) : null}
    </>
  );
}
