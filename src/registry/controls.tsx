"use client";

import { Locate, Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMap } from "@/registry/map";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const positionClasses: Record<Corner, string> = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
};

export type ControlsProps = {
  /** Corner to anchor the controls to. Defaults to top-right. */
  position?: Corner;
  /** Show the geolocate button. Defaults to true. */
  geolocate?: boolean;
  className?: string;
};

export function Controls({
  position = "top-right",
  geolocate = true,
  className,
}: ControlsProps) {
  const { map } = useMap();
  const [locating, setLocating] = useState(false);

  if (!map) return null;

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14 });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true },
    );
  };

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col gap-1",
        positionClasses[position],
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
      >
        <Plus />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
      >
        <Minus />
      </Button>
      {geolocate ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="My location"
          disabled={locating}
          onClick={handleLocate}
        >
          <Locate className={cn(locating && "animate-pulse")} />
        </Button>
      ) : null}
    </div>
  );
}
