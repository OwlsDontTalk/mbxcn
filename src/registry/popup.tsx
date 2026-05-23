"use client";

import mapboxgl, { type PopupOptions } from "mapbox-gl";
import { useEffect, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { useMap } from "@/registry/map";
import { useMarker } from "@/registry/marker";

export type PopupProps = {
  children: ReactNode;
  /** Longitude. Ignored when the popup is nested inside a `<Marker>`. */
  lng?: number;
  /** Latitude. Ignored when the popup is nested inside a `<Marker>`. */
  lat?: number;
  className?: string;
  onClose?: () => void;
} & Omit<PopupOptions, "className">;

export function Popup({
  children,
  lng,
  lat,
  className,
  onClose,
  ...options
}: PopupProps) {
  const { map } = useMap();
  const marker = useMarker();

  // Stable DOM node we portal the React children into.
  const container = useMemo(() => {
    const el = document.createElement("div");
    el.className = "mbxcn-popup-content";
    return el;
  }, []);

  useEffect(() => {
    if (!map) return;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      ...options,
      className: cn("mbxcn-popup", className),
    })
      .setDOMContent(container)
      .setMaxWidth("none");

    if (onClose) popup.on("close", onClose);

    if (marker) {
      marker.getPopup()?.remove();
      marker.setPopup(popup);
    } else if (lng !== undefined && lat !== undefined) {
      popup.setLngLat([lng, lat]).addTo(map);
    }

    return () => {
      if (onClose) popup.off("close", onClose);
      popup.remove();
      if (marker?.getPopup()) marker.setPopup(null);
    };
  }, [map, marker, lng, lat, className, container, onClose, options]);

  return createPortal(children, container);
}
