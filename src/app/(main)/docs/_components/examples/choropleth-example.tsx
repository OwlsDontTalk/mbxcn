"use client";

import type { GeoJSONFeature } from "mapbox-gl";
import { useState } from "react";

import { Choropleth, type ChoroplethRamp } from "@/registry/choropleth";
import { Legend } from "@/registry/legend";
import { Map } from "@/registry/map";

// One ramp object, shared by the map and the legend - they cannot drift.
const ramp = {
  kind: "step",
  breaks: [7, 12, 17],
  colors: ["#eef2f6", "#ccd6e0", "#9fb1c2", "#6d859c"],
} satisfies ChoroplethRamp;

export function ChoroplethExample() {
  const [feature, setFeature] = useState<GeoJSONFeature | null>(null);
  const area = feature ? Number(feature.properties?.area) : null;

  return (
    <div className="relative h-[460px] w-full">
      <Map center={[-104.996, 39.737]} zoom={9.9}>
        <Choropleth
          id="zips"
          data="/data/denver-zips.geojson"
          value="area"
          ramp={ramp}
          featureId="zip"
          opacity={0.55}
          onHover={setFeature}
        />
      </Map>

      <Legend
        ramp={ramp}
        title="ZIP area · km²"
        activeValue={area}
        className="absolute top-3 left-3 z-10"
      />

      <div className="bg-background/85 absolute bottom-3 left-3 z-10 rounded-md border px-2.5 py-1 text-xs backdrop-blur">
        {feature ? (
          <span>
            <span className="font-mono font-semibold">
              {String(feature.properties?.zip)}
            </span>
            <span className="text-muted-foreground">
              {" "}
              · {area?.toFixed(1)} km²
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">Hover a ZIP</span>
        )}
      </div>

      <div className="bg-background/85 text-muted-foreground absolute right-3 bottom-3 z-10 rounded-md border px-2 py-1 text-[11px] backdrop-blur">
        40 central Denver ZIPs
      </div>
    </div>
  );
}
