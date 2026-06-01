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

/** A Mapbox Standard light preset. Ignored by styles that don't expose it. */
export type LightPreset = "day" | "dusk" | "dawn" | "night";

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
  /**
   * Use a single fixed style (e.g. "mapbox://styles/mapbox/standard"). Takes
   * precedence over `theme`/`styles` and disables theme-based style swapping.
   */
  mapStyle?: string;
  /**
   * Light preset for the Mapbox Standard style: "day", "dusk", "dawn", "night".
   * Re-applied across style swaps; ignored by styles without a light preset.
   */
  lightPreset?: LightPreset;
  /** Mapbox access token. Falls back to NEXT_PUBLIC_MAPBOX_TOKEN. */
  accessToken?: string;
} & Omit<MapOptions, "container" | "style" | "accessToken">;

const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme: themeProp,
    styles,
    mapStyle,
    lightPreset,
    accessToken,
    ...options
  },
  ref,
) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const appliedStyleRef = useRef<string | null>(null);
  const lightPresetRef = useRef<LightPreset | undefined>(lightPreset);
  const resolvedTheme = useResolvedTheme(themeProp);

  const mapStyles = useMemo(() => ({ ...defaultStyles, ...styles }), [styles]);
  // A fixed `mapStyle` wins; otherwise the style follows the resolved theme.
  const activeStyle = mapStyle ?? mapStyles[resolvedTheme];

  // Speed up tile/3D parsing: give Mapbox more workers (default is 2) and
  // pre-initialize the shared WebWorkers so they survive map removals and SPA
  // navigations. Both must run before maps are created; prewarm() is idempotent.
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      mapboxgl.workerCount = Math.min(navigator.hardwareConcurrency || 4, 8);
    }
    mapboxgl.prewarm();
  }, []);

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

    appliedStyleRef.current = activeStyle;
    const instance = new mapboxgl.Map({
      container,
      accessToken: token,
      style: activeStyle,
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

    // Re-apply the light preset on every style load so it survives style swaps.
    instance.on("style.load", () => {
      const preset = lightPresetRef.current;
      if (!preset) return;
      try {
        instance.setConfigProperty("basemap", "lightPreset", preset);
      } catch {
        // The active style has no light preset (e.g. classic styles); ignore.
      }
    });

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

  // Swap the basemap when the active style changes (theme or `mapStyle`).
  useEffect(() => {
    if (!map || appliedStyleRef.current === activeStyle) return;
    appliedStyleRef.current = activeStyle;
    map.setStyle(activeStyle);
  }, [map, activeStyle]);

  // Apply the light preset when it changes without a style swap.
  useEffect(() => {
    lightPresetRef.current = lightPreset;
    if (!map || !lightPreset) return;
    try {
      map.setConfigProperty("basemap", "lightPreset", lightPreset);
    } catch {
      // The active style has no light preset; ignore.
    }
  }, [map, lightPreset]);

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
