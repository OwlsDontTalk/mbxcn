"use client";

import type { GeoJSONFeature } from "mapbox-gl";
import { useState } from "react";

import { Choropleth, type ChoroplethRamp } from "@/registry/choropleth";
import { Map } from "@/registry/map";

// One ramp object. It builds the paint expression on the map, and the swatches
// in the legend below are rendered by mapping over this same array.
const ramp = {
  kind: "step",
  breaks: [7, 12, 17],
  colors: ["#eef2f6", "#ccd6e0", "#9fb1c2", "#6d859c"],
} satisfies ChoroplethRamp;

const bandLabels = ["0-7", "7-12", "12-17", "17+"];

export function ChoroplethExample() {
  const [feature, setFeature] = useState<GeoJSONFeature | null>(null);
  const area = feature ? Number(feature.properties?.area) : null;
  const activeBand =
    area === null ? -1 : ramp.breaks.filter((brk) => area >= brk).length;

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

      <div className="bg-background/85 absolute top-3 left-3 z-10 rounded-md border px-3 py-2 backdrop-blur">
        <div className="text-muted-foreground text-[10px] tracking-wider uppercase">
          ZIP area · km²
        </div>

        <div className="mt-2 flex gap-1">
          {ramp.colors.map((color, index) => (
            <div key={color} className="w-12">
              <div
                className="h-3 rounded-sm border transition-transform"
                style={{
                  background: color,
                  transform: activeBand === index ? "scaleY(1.5)" : undefined,
                }}
              />
              <div
                className={
                  activeBand === index
                    ? "text-foreground mt-1 text-center text-[10px] font-semibold"
                    : "text-muted-foreground mt-1 text-center text-[10px]"
                }
              >
                {bandLabels[index]}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 border-t pt-2 text-xs">
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
      </div>

      <div className="bg-background/85 text-muted-foreground absolute right-3 bottom-3 z-10 rounded-md border px-2 py-1 text-[11px] backdrop-blur">
        40 central Denver ZIPs
      </div>
    </div>
  );
}
