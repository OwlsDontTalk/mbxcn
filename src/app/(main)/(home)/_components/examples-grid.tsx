"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Coffee,
  Footprints,
  Globe,
  Mountain,
  Music,
  PenTool,
  Search,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { type LayerSpecification } from "mapbox-gl";

import { Map, useMap, type LightPreset } from "@/registry/map";
import { Marker } from "@/registry/marker";
import { ExampleCard, PlaceholderCard } from "./example-card";
import { InView } from "./in-view";

// Camera for the 3D hero (downtown Austin). Interaction is constrained: a small
// zoom range and a tight pan box so it can be nudged but not flung around or
// zoomed deep into heavy landmark meshes. Tweak to taste.
const hero3d = {
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

type Poi = {
  name: string;
  lng: number;
  lat: number;
  icon: LucideIcon;
  color: string;
};

const pois: Poi[] = [
  { name: "Blue Bottle", lng: -122.4231, lat: 37.7766, icon: Coffee, color: "bg-amber-600" },
  { name: "Tartine", lng: -122.4242, lat: 37.7614, icon: UtensilsCrossed, color: "bg-rose-500" },
  { name: "Dolores Park", lng: -122.4271, lat: 37.7596, icon: Trees, color: "bg-emerald-600" },
  { name: "Trick Dog", lng: -122.4124, lat: 37.7596, icon: Wine, color: "bg-violet-600" },
  { name: "Amoeba Music", lng: -122.4546, lat: 37.7693, icon: Music, color: "bg-sky-600" },
  { name: "Ferry Building", lng: -122.3933, lat: 37.7956, icon: ShoppingBag, color: "bg-orange-500" },
];

const routePath: [number, number][] = [
  [-122.3937, 37.7955],
  [-122.3998, 37.7937],
  [-122.4058, 37.7881],
  [-122.4074, 37.7858],
  [-122.4183, 37.7793],
];

// Downtown Oakland, CA (14th & Broadway) - origin for the isochrone demo.
const oaklandCenter: [number, number] = [-122.2711, 37.8044];

const placeholders: { icon: LucideIcon; label: string }[] = [
  { icon: Globe, label: "Globe" },
  { icon: Mountain, label: "Terrain" },
  { icon: PenTool, label: "Drawing" },
  { icon: Search, label: "Search" },
];

function RouteLayer({ path }: { path: [number, number][] }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;
    const id = "route-demo";
    const data: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: path },
    };
    const add = () => {
      if (!map.getSource(id)) map.addSource(id, { type: "geojson", data });
      if (!map.getLayer(id)) {
        map.addLayer({
          id,
          type: "line",
          source: id,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#6366f1", "line-width": 4, "line-opacity": 0.9 },
        } as unknown as LayerSpecification);
      }
    };
    add();
    map.on("style.load", add);
    return () => {
      map.off("style.load", add);
      try {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
      } catch {
        // Map was torn down before this cleanup ran; nothing to remove.
      }
    };
  }, [map, path]);

  return null;
}

type IsochroneProfile = "walking" | "driving" | "cycling";

/**
 * Fetches a travel-time boundary from the Mapbox Isochrone API (how far you can
 * reach within `minutes` from `center`) and draws it as a filled polygon.
 */
function IsochroneLayer({
  center,
  profile = "walking",
  minutes = 20,
}: {
  center: [number, number];
  profile?: IsochroneProfile;
  minutes?: number;
}) {
  const { map } = useMap();
  const [data, setData] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    const url =
      `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/` +
      `${center[0]},${center[1]}?contours_minutes=${minutes}` +
      `&polygons=true&denoise=1&access_token=${token}`;

    let active = true;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (active) setData(json as GeoJSON.FeatureCollection);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [center, profile, minutes]);

  useEffect(() => {
    if (!map || !data) return;
    const source = "isochrone-demo";
    const fill = "isochrone-fill";
    const outline = "isochrone-outline";
    const add = () => {
      if (!map.getSource(source)) map.addSource(source, { type: "geojson", data });
      if (!map.getLayer(fill)) {
        map.addLayer({
          id: fill,
          type: "fill",
          source,
          paint: { "fill-color": "#6366f1", "fill-opacity": 0.25 },
        } as unknown as LayerSpecification);
      }
      if (!map.getLayer(outline)) {
        map.addLayer({
          id: outline,
          type: "line",
          source,
          paint: { "line-color": "#6366f1", "line-width": 2 },
        } as unknown as LayerSpecification);
      }
    };
    add();
    map.on("style.load", add);
    return () => {
      map.off("style.load", add);
      try {
        if (map.getLayer(outline)) map.removeLayer(outline);
        if (map.getLayer(fill)) map.removeLayer(fill);
        if (map.getSource(source)) map.removeSource(source);
      } catch {
        // Map was torn down before this cleanup ran; nothing to remove.
      }
    };
  }, [map, data]);

  return null;
}

function Hero3D() {
  const { resolvedTheme } = useTheme();
  const lightPreset: LightPreset = resolvedTheme === "dark" ? "night" : "day";

  return (
    <Map
      mapStyle="mapbox://styles/mapbox/standard"
      lightPreset={lightPreset}
      center={hero3d.center}
      zoom={hero3d.zoom}
      minZoom={hero3d.minZoom}
      maxZoom={hero3d.maxZoom}
      maxBounds={hero3d.maxBounds}
      pitch={hero3d.pitch}
      bearing={hero3d.bearing}
      pitchWithRotate={false}
      dragRotate={false}
      fadeDuration={0}
    />
  );
}

export function ExamplesGrid() {
  return (
    <div className="space-y-5">
      <ExampleCard className="h-[58vh] min-h-[380px]">
        <div className="bg-background/90 border-border/50 absolute top-3 left-3 z-10 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="text-muted-foreground text-[10px] tracking-wider uppercase">
            3D · follows day / night
          </div>
          <div className="text-sm font-semibold">Austin, TX</div>
        </div>
        <Hero3D />
      </ExampleCard>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ExampleCard className="h-72">
          <div className="bg-background/90 border-border/50 absolute top-3 left-3 z-10 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
            Route A -&gt; B
          </div>
          <InView>
            <Map center={[-122.406, 37.787]} zoom={12.6}>
              <RouteLayer path={routePath} />
              <Marker lng={routePath[0][0]} lat={routePath[0][1]}>
                <span className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-[11px] font-bold text-white shadow">
                  A
                </span>
              </Marker>
              <Marker
                lng={routePath[routePath.length - 1][0]}
                lat={routePath[routePath.length - 1][1]}
              >
                <span className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-[11px] font-bold text-white shadow">
                  B
                </span>
              </Marker>
            </Map>
          </InView>
        </ExampleCard>

        <ExampleCard className="h-72">
          <div className="bg-background/90 border-border/50 absolute top-3 left-3 z-10 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
            Points
          </div>
          <InView>
            <Map center={[-122.4233, 37.7715]} zoom={12.2}>
              {pois.map((poi) => (
                <Marker key={poi.name} lng={poi.lng} lat={poi.lat}>
                  <span
                    className={`flex size-7 items-center justify-center rounded-full border-2 border-white text-white shadow-md ${poi.color}`}
                  >
                    <poi.icon className="size-3.5" />
                  </span>
                </Marker>
              ))}
            </Map>
          </InView>
        </ExampleCard>

        <ExampleCard className="h-72">
          <div className="bg-background/90 border-border/50 absolute top-3 left-3 z-10 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
            20-min walk · Oakland
          </div>
          <InView>
            <Map center={oaklandCenter} zoom={12.6}>
              <IsochroneLayer center={oaklandCenter} profile="walking" minutes={20} />
              <Marker lng={oaklandCenter[0]} lat={oaklandCenter[1]}>
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md">
                  <Footprints className="size-3.5" />
                </span>
              </Marker>
            </Map>
          </InView>
        </ExampleCard>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {placeholders.map((item) => (
          <PlaceholderCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            className="h-36"
          />
        ))}
      </div>
    </div>
  );
}
