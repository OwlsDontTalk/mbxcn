"use client";

import { Clock, MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Controls } from "@/registry/controls";
import { Map, useMap } from "@/registry/map";
import { Marker } from "@/registry/marker";
import { Popup } from "@/registry/popup";
import { locations, type Location } from "./data";

/** Flies the map to the selected location whenever it changes. */
function FlyTo({ location }: { location: Location }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    map.flyTo({ center: [location.lng, location.lat], zoom: 14, speed: 1.2 });
  }, [map, isLoaded, location]);

  return null;
}

export default function StoreLocator() {
  const [selectedId, setSelectedId] = useState(locations[0].id);
  const selected =
    locations.find((location) => location.id === selectedId) ?? locations[0];

  return (
    <div className="relative h-screen w-full">
      <Map center={[selected.lng, selected.lat]} zoom={12}>
        <Controls position="top-right" />
        <FlyTo location={selected} />

        {locations.map((location) => {
          const active = location.id === selectedId;
          return (
            <Marker
              key={location.id}
              lng={location.lng}
              lat={location.lat}
              onClick={() => setSelectedId(location.id)}
            >
              <MapPin
                className={cn(
                  "size-7 cursor-pointer drop-shadow transition-transform hover:scale-110",
                  active
                    ? "fill-primary text-primary-foreground"
                    : "fill-muted-foreground/80 text-background",
                )}
              />
            </Marker>
          );
        })}

        <Popup lng={selected.lng} lat={selected.lat}>
          <div className="bg-popover text-popover-foreground w-56 rounded-lg border p-3 shadow-md">
            <p className="font-medium">{selected.name}</p>
            <p className="text-muted-foreground text-xs">{selected.address}</p>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <Clock className="size-3" />
              {selected.hours}
            </p>
          </div>
        </Popup>
      </Map>

      <aside className="bg-background/95 absolute inset-y-4 left-4 z-10 flex w-72 max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-xl border shadow-lg backdrop-blur-md">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Coffee in Austin</h2>
          <p className="text-muted-foreground text-xs">
            {locations.length} locations nearby
          </p>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {locations.map((location) => {
            const active = location.id === selectedId;
            return (
              <li key={location.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(location.id)}
                  className={cn(
                    "hover:bg-muted/60 flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors",
                    active && "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {active ? (
                      <Navigation className="size-3.5" />
                    ) : (
                      <MapPin className="size-3.5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {location.name}
                    </span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {location.address}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
