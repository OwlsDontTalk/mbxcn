"use client";

import mapboxgl, { type MarkerOptions } from "mapbox-gl";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useMap } from "@/registry/map";

const MarkerContext = createContext<mapboxgl.Marker | null>(null);

/** Access the parent `<Marker>` instance (e.g. to attach a `<Popup>`). */
export function useMarker() {
  return useContext(MarkerContext);
}

export type MarkerProps = {
  /** Longitude of the marker. */
  lng: number;
  /** Latitude of the marker. */
  lat: number;
  /**
   * Marker content. When provided, it becomes the marker element (custom pin).
   * A `<Popup>` child renders nothing here, so a marker that only wraps a Popup
   * falls back to the default Mapbox pin.
   */
  children?: ReactNode;
  onClick?: (marker: mapboxgl.Marker) => void;
} & Omit<MarkerOptions, "element">;

export function Marker({ lng, lat, children, onClick, ...options }: MarkerProps) {
  const { map } = useMap();
  const elementRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Use the rendered children as a custom element only if they produced DOM.
    const el = elementRef.current;
    const hasCustomContent = !!el && el.childNodes.length > 0;

    const instance = new mapboxgl.Marker({
      ...options,
      ...(hasCustomContent ? { element: el } : {}),
    })
      .setLngLat([lng, lat])
      .addTo(map);

    const handleClick = () => onClick?.(instance);
    instance.getElement().addEventListener("click", handleClick);

    setMarker(instance);

    return () => {
      instance.getElement().removeEventListener("click", handleClick);
      instance.remove();
      setMarker(null);
    };
    // Recreate on map/position change. Options/children are read at creation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, lng, lat]);

  return (
    <MarkerContext.Provider value={marker}>
      <div ref={elementRef}>{children}</div>
    </MarkerContext.Provider>
  );
}
