"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Map, type LightPreset } from "@/registry/map";

const presets: LightPreset[] = ["day", "dusk", "dawn", "night"];

export function MapModesExample() {
  const [preset, setPreset] = useState<LightPreset>("day");

  return (
    <div className="relative h-[420px] w-full">
      <Map
        mapStyle="mapbox://styles/mapbox/standard"
        lightPreset={preset}
        center={[-73.9857, 40.7484]}
        zoom={15.5}
        pitch={55}
        bearing={-20}
      />
      <div className="absolute top-3 left-3 z-10 flex gap-1 rounded-md border bg-background/80 p-1 backdrop-blur">
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
