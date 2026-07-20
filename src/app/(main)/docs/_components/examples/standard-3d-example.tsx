"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Map, type LightPreset } from "@/registry/map";

const presets: LightPreset[] = ["day", "dusk", "dawn", "night"];

// Downtown Austin. Interaction is constrained: a small zoom range and a tight
// pan box so the camera can be nudged but not flung around or zoomed deep into
// heavy landmark meshes.
const camera = {
  center: [-97.7426, 30.2668] as [number, number],
  zoom: 15.8,
  minZoom: 14,
  maxZoom: 15.8,
  pitch: 52,
  bearing: -20,
  maxBounds: [
    [-97.78, 30.24],
    [-97.7, 30.3],
  ] as [[number, number], [number, number]],
};

export function Standard3DExample() {
  const [preset, setPreset] = useState<LightPreset>("day");

  return (
    <div className="relative h-[520px] w-full">
      <Map
        mapStyle="mapbox://styles/mapbox/standard"
        lightPreset={preset}
        center={camera.center}
        zoom={camera.zoom}
        minZoom={camera.minZoom}
        maxZoom={camera.maxZoom}
        maxBounds={camera.maxBounds}
        pitch={camera.pitch}
        bearing={camera.bearing}
        pitchWithRotate={false}
        dragRotate={false}
      />
      <div className="bg-background/80 absolute top-3 left-3 z-10 flex gap-1 rounded-md border p-1 backdrop-blur">
        {presets.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={preset === value ? "default" : "ghost"}
            className="capitalize"
            onClick={() => setPreset(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
