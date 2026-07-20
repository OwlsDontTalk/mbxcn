"use client";

import type { FilterSpecification } from "mapbox-gl";
import { useEffect, useState } from "react";

import { Layer } from "@/registry/layer";
import { Map, useMap } from "@/registry/map";

const zips = "/data/denver-zips.geojson";

type Hovered = { zip: string; city: string; x: number; y: number };

/** Reads the ZIP under the cursor off the transparent hit layer. */
function HoverProbe({ onChange }: { onChange: (value: Hovered | null) => void }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;
    const canvas = map.getCanvas();

    const move = (event: mapboxgl.MapMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;
      canvas.style.cursor = "pointer";
      onChange({
        zip: String(feature.properties?.zip ?? ""),
        city: String(feature.properties?.city ?? ""),
        x: event.point.x,
        y: event.point.y,
      });
    };

    const leave = () => {
      canvas.style.cursor = "";
      onChange(null);
    };

    map.on("mousemove", "zips-hit", move);
    map.on("mouseleave", "zips-hit", leave);

    return () => {
      map.off("mousemove", "zips-hit", move);
      map.off("mouseleave", "zips-hit", leave);
    };
  }, [map, onChange]);

  return null;
}

export function LayerExample() {
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const highlight: FilterSpecification = [
    "==",
    ["get", "zip"],
    hovered?.zip ?? "",
  ];

  return (
    <div className="relative h-[460px] w-full">
      <Map center={[-104.996, 39.737]} zoom={10.4}>
        <Layer
          id="zips-hit"
          type="fill"
          data={zips}
          paint={{ "fill-color": "#000000", "fill-opacity": 0 }}
        />
        <Layer
          id="zips-border"
          type="line"
          source="zips-hit"
          paint={{
            "line-color": "#3b82f6",
            "line-width": 0.7,
            "line-opacity": 0.55,
          }}
        />
        <Layer
          id="zips-hover"
          type="line"
          source="zips-hit"
          filter={highlight}
          paint={{ "line-color": "#1d4ed8", "line-width": 2.2 }}
        />
        <HoverProbe onChange={setHovered} />
      </Map>

      {hovered ? (
        <div
          className="bg-background/95 pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md border px-2 py-1 shadow-md backdrop-blur"
          style={{ left: hovered.x, top: hovered.y }}
        >
          <div className="font-mono text-sm font-semibold">{hovered.zip}</div>
          <div className="text-muted-foreground text-[11px]">{hovered.city}</div>
        </div>
      ) : null}

      <div className="bg-background/85 text-muted-foreground absolute right-3 bottom-3 z-10 rounded-md border px-2 py-1 text-[11px] backdrop-blur">
        40 central Denver ZIPs · hover for the code
      </div>
    </div>
  );
}
