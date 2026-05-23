"use client";

import { MapPin } from "lucide-react";

import { Controls } from "@/registry/controls";
import { Map } from "@/registry/map";
import { Marker } from "@/registry/marker";
import { ExampleCard } from "./example-card";

const landmarks = [
  { name: "Texas State Capitol", lng: -97.7404, lat: 30.2747 },
  { name: "Zilker Park", lng: -97.7713, lat: 30.2669 },
  { name: "UT Austin", lng: -97.7394, lat: 30.2862 },
  { name: "Lady Bird Lake", lng: -97.748, lat: 30.2566 },
];

const neighborhoods = [
  { name: "Downtown", lng: -97.7431, lat: 30.2672, color: "bg-rose-500" },
  { name: "East Austin", lng: -97.7188, lat: 30.2649, color: "bg-amber-500" },
  { name: "South Congress", lng: -97.7503, lat: 30.2489, color: "bg-emerald-500" },
  { name: "Hyde Park", lng: -97.7295, lat: 30.3035, color: "bg-sky-500" },
  { name: "Mueller", lng: -97.7048, lat: 30.2988, color: "bg-violet-500" },
];

export function ExamplesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ExampleCard className="h-80">
        <Map center={[-97.7503, 30.2759]} zoom={12}>
          {landmarks.map((place) => (
            <Marker key={place.name} lng={place.lng} lat={place.lat}>
              <MapPin className="fill-primary text-primary-foreground size-6 drop-shadow" />
            </Marker>
          ))}
        </Map>
      </ExampleCard>

      <ExampleCard className="h-80">
        <Map center={[-97.7431, 30.2672]} zoom={11}>
          <Controls position="top-right" />
        </Map>
      </ExampleCard>

      <ExampleCard className="h-80 lg:col-span-2">
        <div className="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md">
          <div className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">
            Active areas
          </div>
          <div className="text-2xl leading-tight font-semibold">5</div>
          <div className="text-muted-foreground mt-0.5 text-xs">
            across Austin, TX
          </div>
        </div>
        <Map center={[-97.7331, 30.2772]} zoom={12}>
          {neighborhoods.map((area) => (
            <Marker key={area.name} lng={area.lng} lat={area.lat}>
              <span
                className={`block size-3.5 rounded-full border-2 border-white shadow-lg ${area.color}`}
              />
            </Marker>
          ))}
        </Map>
      </ExampleCard>
    </div>
  );
}
