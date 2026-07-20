"use client";

import type {
  FilterSpecification,
  GeoJSONSourceSpecification,
  LayerSpecification,
  Map as MapboxMap,
} from "mapbox-gl";
import { useEffect, useRef } from "react";

import { useMap } from "@/registry/map";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type SpecFor<T extends LayerSpecification["type"]> = Extract<
  LayerSpecification,
  { type: T }
>;

export type LayerProps<
  T extends LayerSpecification["type"] = LayerSpecification["type"],
> = DistributiveOmit<SpecFor<T>, "id" | "source"> & {
  /** Unique layer id. Also names the source this layer creates. */
  id: string;
  /**
   * GeoJSON data or a URL. The layer creates and owns a source for it.
   * Pass a stable reference (e.g. `useMemo`) - a new object triggers `setData`.
   */
  data?: GeoJSONSourceSpecification["data"];
  /** Use an existing source instead of creating one. Takes precedence over `data`. */
  source?: string;
  /** Extra source options, e.g. `cluster`, `promoteId`, `generateId`. */
  sourceOptions?: Omit<GeoJSONSourceSpecification, "type" | "data">;
  /** Insert this layer below `beforeId`. Ignored when that layer is absent. */
  beforeId?: string;
};

type ResolvedProps = {
  id: string;
  type: LayerSpecification["type"];
  data?: GeoJSONSourceSpecification["data"];
  source?: string;
  sourceOptions?: Omit<GeoJSONSourceSpecification, "type" | "data">;
  beforeId?: string;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  filter?: FilterSpecification;
};

const sourceless = new Set(["background", "sky", "slot"]);

/** Other layers may share this source; removing it while they exist throws. */
function sourceInUse(map: MapboxMap, sourceId: string) {
  const layers = map.getStyle()?.layers;
  if (!layers) return false;
  return layers.some(
    (layer) => "source" in layer && layer.source === sourceId,
  );
}

function applyProperties(
  next: Record<string, unknown> | undefined,
  previous: Record<string, unknown> | undefined,
  set: (key: string, value: unknown) => void,
) {
  for (const key of Object.keys(next ?? {})) {
    if (next?.[key] !== previous?.[key]) set(key, next?.[key]);
  }
  // Properties dropped between renders must be reset, not left applied.
  for (const key of Object.keys(previous ?? {})) {
    if (!(key in (next ?? {}))) set(key, undefined);
  }
}

export function Layer<
  T extends LayerSpecification["type"] = LayerSpecification["type"],
>(props: LayerProps<T>) {
  const { map } = useMap();

  const {
    id,
    type,
    data,
    source,
    sourceOptions,
    beforeId,
    paint,
    layout,
    filter,
    ...rest
  } = props as unknown as ResolvedProps & Record<string, unknown>;

  const sourceId = source ?? id;
  const ownsSource = !source && !sourceless.has(type);

  const latest = useRef({ data, sourceOptions, paint, layout, filter, rest });

  useEffect(() => {
    latest.current = { data, sourceOptions, paint, layout, filter, rest };
  });

  const applied = useRef<{
    paint?: Record<string, unknown>;
    layout?: Record<string, unknown>;
  }>({});

  useEffect(() => {
    if (!map) return;

    const add = () => {
      const current = latest.current;

      if (ownsSource && !map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: current.data ?? { type: "FeatureCollection", features: [] },
          ...current.sourceOptions,
        });
      }

      if (map.getLayer(id)) return;

      const spec = {
        ...current.rest,
        id,
        type,
        ...(sourceless.has(type) ? {} : { source: sourceId }),
        ...(current.paint ? { paint: current.paint } : {}),
        ...(current.layout ? { layout: current.layout } : {}),
        ...(current.filter ? { filter: current.filter } : {}),
      } as LayerSpecification;

      // Mapbox throws when beforeId names a layer the current style lacks.
      const before = beforeId && map.getLayer(beforeId) ? beforeId : undefined;
      map.addLayer(spec, before);

      applied.current = { paint: current.paint, layout: current.layout };
    };

    add();
    // setStyle() drops every user source and layer, so re-add on each new style.
    map.on("style.load", add);

    return () => {
      map.off("style.load", add);
      try {
        if (map.getLayer(id)) map.removeLayer(id);
        if (
          ownsSource &&
          map.getSource(sourceId) &&
          !sourceInUse(map, sourceId)
        ) {
          map.removeSource(sourceId);
        }
      } catch {
        // The map (or its style) is already gone; nothing left to clean up.
      }
      applied.current = {};
    };
  }, [map, id, type, sourceId, ownsSource, beforeId]);

  useEffect(() => {
    if (!map || !ownsSource || data === undefined) return;
    const geojson = map.getSource(sourceId);
    if (geojson?.type === "geojson") geojson.setData(data);
  }, [map, sourceId, ownsSource, data]);

  useEffect(() => {
    if (!map || !map.getLayer(id)) return;
    applyProperties(paint, applied.current.paint, (key, value) =>
      map.setPaintProperty(
        id,
        key as Parameters<typeof map.setPaintProperty>[1],
        value as Parameters<typeof map.setPaintProperty>[2],
      ),
    );
    applied.current.paint = paint;
    // Compared by value: inline paint objects would otherwise re-run every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, id, JSON.stringify(paint)]);

  useEffect(() => {
    if (!map || !map.getLayer(id)) return;
    applyProperties(layout, applied.current.layout, (key, value) =>
      map.setLayoutProperty(
        id,
        key as Parameters<typeof map.setLayoutProperty>[1],
        value as Parameters<typeof map.setLayoutProperty>[2],
      ),
    );
    applied.current.layout = layout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, id, JSON.stringify(layout)]);

  useEffect(() => {
    if (!map || !map.getLayer(id)) return;
    map.setFilter(id, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, id, JSON.stringify(filter)]);

  return null;
}
