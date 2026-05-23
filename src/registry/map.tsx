"use client";

import mapboxgl, { type MapOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

const defaultStyles = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
};

type Theme = "light" | "dark";

/** Read the theme from the document class (works with next-themes). */
function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Resolve the theme from a prop, the document class, or the system preference. */
function useResolvedTheme(themeProp?: Theme): Theme {
  const [theme, setTheme] = useState<Theme>(
    () => getDocumentTheme() ?? getSystemTheme(),
  );

  useEffect(() => {
    if (themeProp) return;

    const sync = () => setTheme(getDocumentTheme() ?? getSystemTheme());

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
    };
  }, [themeProp]);

  return themeProp ?? theme;
}

type MapContextValue = {
  map: mapboxgl.Map | null;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

/** Access the underlying Mapbox map instance from a child of `<Map>`. */
export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a <Map> component");
  }
  return context;
}

export type MapRef = mapboxgl.Map;

export type MapProps = {
  children?: ReactNode;
  /** Additional classes for the map container. */
  className?: string;
  /** Theme for the basemap. Auto-detected from the document class if omitted. */
  theme?: Theme;
  /** Override the default Mapbox styles per theme. */
  styles?: { light?: string; dark?: string };
  /** Mapbox access token. Falls back to NEXT_PUBLIC_MAPBOX_TOKEN. */
  accessToken?: string;
} & Omit<MapOptions, "container" | "style" | "accessToken">;

const Map = forwardRef<MapRef, MapProps>(function Map(
  { children, className, theme: themeProp, styles, accessToken, ...options },
  ref,
) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const appliedStyleRef = useRef<string | null>(null);
  const resolvedTheme = useResolvedTheme(themeProp);

  const mapStyles = useMemo(() => ({ ...defaultStyles, ...styles }), [styles]);

  // Initialize the map once the container is mounted.
  useEffect(() => {
    if (!container) return;

    const token = accessToken ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error(
        "Map: missing Mapbox token. Pass `accessToken` or set NEXT_PUBLIC_MAPBOX_TOKEN.",
      );
      return;
    }

    const style = mapStyles[resolvedTheme];
    appliedStyleRef.current = style;
    const instance = new mapboxgl.Map({
      container,
      accessToken: token,
      style,
      // We add a compact attribution below; pass `attributionControl` to override.
      attributionControl: false,
      ...options,
    });

    // Collapse the verbose attribution into a compact "ⓘ" toggle by default.
    // Mapbox's ToS requires attribution, so we keep it (just out of the way)
    // unless the consumer explicitly opts out via `attributionControl`.
    if (options.attributionControl === undefined) {
      instance.addControl(new mapboxgl.AttributionControl({ compact: true }));
    }

    instance.on("load", () => setIsLoaded(true));
    // Store the imperatively created map so children can read it via context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMap(instance);

    return () => {
      instance.remove();
      appliedStyleRef.current = null;
      setMap(null);
      setIsLoaded(false);
    };
    // Init once per container mount. Theme/style swaps are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  // Swap the basemap style when the resolved theme changes.
  useEffect(() => {
    const style = mapStyles[resolvedTheme];
    if (!map || appliedStyleRef.current === style) return;
    appliedStyleRef.current = style;
    map.setStyle(style);
  }, [map, resolvedTheme, mapStyles]);

  useImperativeHandle(ref, () => map as mapboxgl.Map, [map]);

  const contextValue = useMemo<MapContextValue>(
    () => ({ map, isLoaded }),
    [map, isLoaded],
  );

  return (
    <div
      ref={setContainer}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <MapContext.Provider value={contextValue}>
        {isLoaded ? children : null}
      </MapContext.Provider>
    </div>
  );
});

export { Map };
