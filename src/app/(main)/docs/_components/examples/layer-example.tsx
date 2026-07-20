"use client";

import type { ExpressionSpecification } from "mapbox-gl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Layer } from "@/registry/layer";
import { Map } from "@/registry/map";

type Kind = "circle" | "heatmap";

const stops: [number, number][] = [
  [-104.9903, 39.7392],
  [-104.9847, 39.7476],
  [-105.0008, 39.745],
  [-104.9781, 39.7405],
  [-104.9942, 39.7508],
  [-105.0104, 39.7362],
  [-104.9689, 39.7331],
  [-104.9876, 39.7269],
  [-105.0201, 39.7481],
  [-104.9617, 39.7524],
  [-104.9755, 39.7601],
  [-105.0053, 39.7215],
];

const heatColor: ExpressionSpecification = [
  "interpolate",
  ["linear"],
  ["heatmap-density"],
  0,
  "rgba(109,133,156,0)",
  0.4,
  "rgba(109,133,156,0.45)",
  1,
  "rgba(71,90,110,0.8)",
];

export function LayerExample() {
  const [kind, setKind] = useState<Kind>("circle");

  const points = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: stops.map(([lng, lat], index) => ({
        type: "Feature" as const,
        properties: { weight: ((index * 7) % 10) / 10 + 0.2 },
        geometry: { type: "Point" as const, coordinates: [lng, lat] },
      })),
    }),
    [],
  );

  return (
    <div className="relative h-[420px] w-full">
      <Map center={[-104.99, 39.742]} zoom={12.2}>
        {kind === "circle" ? (
          <Layer
            id="stops"
            type="circle"
            data={points}
            paint={{
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                4,
                14,
                12,
              ],
              "circle-color": "#6d859c",
              "circle-opacity": 0.9,
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#ffffff",
            }}
          />
        ) : (
          <Layer
            id="stops"
            type="heatmap"
            data={points}
            paint={{
              "heatmap-weight": ["get", "weight"],
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                20,
                14,
                45,
              ],
              "heatmap-color": heatColor,
              "heatmap-opacity": 0.85,
            }}
          />
        )}
      </Map>

      <div className="bg-background/85 absolute top-3 left-3 z-10 flex gap-1 rounded-md border p-1 backdrop-blur">
        {(["circle", "heatmap"] as Kind[]).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={kind === value ? "default" : "ghost"}
            className="capitalize"
            onClick={() => setKind(value)}
          >
            {value}
          </Button>
        ))}
      </div>

      <div className="bg-background/85 text-muted-foreground absolute right-3 bottom-3 z-10 rounded-md border px-2 py-1 text-[11px] backdrop-blur">
        Same source, different layer type
      </div>
    </div>
  );
}
