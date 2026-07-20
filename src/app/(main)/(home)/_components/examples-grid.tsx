"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Coffee,
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
import {
  type FilterSpecification,
  type LayerSpecification,
} from "mapbox-gl";

import { Layer } from "@/registry/layer";
import { Map, useMap } from "@/registry/map";
import { Marker } from "@/registry/marker";
import { ExampleCard, PlaceholderCard } from "./example-card";
import { InView } from "./in-view";

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

// Downtown San Francisco to Monterey, roughly following US-101 then CA-68.
const routePath: [number, number][] = [
  [-122.4194, 37.7749],
  [-122.4048, 37.7095],
  [-122.4052, 37.6547],
  [-122.3255, 37.563],
  [-122.2364, 37.4852],
  [-122.143, 37.4419],
  [-121.9886, 37.3688],
  [-121.8863, 37.3382],
  [-121.7681, 37.2431],
  [-121.6544, 37.1305],
  [-121.5683, 36.9905],
  [-121.6, 36.85],
  [-121.6555, 36.6777],
  [-121.7846, 36.6208],
  [-121.8947, 36.6002],
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

    // Frame the whole route: the card's width changes with the breakpoint, so a
    // hardcoded center/zoom would crop it on some layouts.
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    for (const [lng, lat] of path) {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }
    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 34, duration: 0 },
    );

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

function collectPositions(features: GeoJSON.Feature[]): [number, number][] {
  const out: [number, number][] = [];
  for (const { geometry } of features) {
    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates)
        for (const p of ring) out.push(p as [number, number]);
    } else if (geometry.type === "MultiPolygon") {
      for (const poly of geometry.coordinates)
        for (const ring of poly) for (const p of ring) out.push(p as [number, number]);
    }
  }
  return out;
}

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

    // Frame the camera to the isochrone polygon.
    const positions = collectPositions(data.features);
    if (positions.length) {
      let minLng = Infinity,
        minLat = Infinity,
        maxLng = -Infinity,
        maxLat = -Infinity;
      for (const [lng, lat] of positions) {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      }
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 24, duration: 0 },
      );
    }

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

type HoveredZip = { zip: string; city: string; x: number; y: number };

function ZipHoverProbe({
  onChange,
}: {
  onChange: (value: HoveredZip | null) => void;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;
    const canvas = map.getCanvas();

    const move = (event: mapboxgl.MapMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;
      canvas.style.cursor = "pointer";
      onChange({
        zip: String(feature.properties?.zip ?? ""),
        city: String(feature.properties?.city ?? ""),
        x: event.point.x,
        y: event.point.y,
      });
    };

    const leave = () => {
      canvas.style.cursor = "";
      onChange(null);
    };

    map.on("mousemove", "home-zips-hit", move);
    map.on("mouseleave", "home-zips-hit", leave);

    return () => {
      map.off("mousemove", "home-zips-hit", move);
      map.off("mouseleave", "home-zips-hit", leave);
    };
  }, [map, onChange]);

  return null;
}

function ZipBoundariesCard() {
  const [hovered, setHovered] = useState<HoveredZip | null>(null);
  const highlight: FilterSpecification = [
    "==",
    ["get", "zip"],
    hovered?.zip ?? "",
  ];

  return (
    <ExampleCard className="h-[380px]">
      <div className="bg-background/90 border-border/50 absolute top-3 left-3 z-10 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
        ZIP boundaries · Denver
      </div>
      <InView>
        <Map center={[-104.996, 39.737]} zoom={9.5}>
          <Layer
            id="home-zips-hit"
            type="fill"
            data="/data/denver-zips.geojson"
            paint={{ "fill-color": "#000000", "fill-opacity": 0 }}
          />
          <Layer
            id="home-zips-border"
            type="line"
            source="home-zips-hit"
            paint={{
              "line-color": "#3b82f6",
              "line-width": 0.9,
              "line-opacity": 0.85,
            }}
          />
          <Layer
            id="home-zips-hover"
            type="line"
            source="home-zips-hit"
            filter={highlight}
            paint={{ "line-color": "#1d4ed8", "line-width": 2.4 }}
          />
          <ZipHoverProbe onChange={setHovered} />
        </Map>
      </InView>
      {hovered ? (
        <div
          className="bg-background/95 pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md border px-2 py-1 shadow-md backdrop-blur"
          style={{ left: hovered.x, top: hovered.y }}
        >
          <div className="font-mono text-sm font-semibold">{hovered.zip}</div>
          <div className="text-muted-foreground text-[11px]">{hovered.city}</div>
        </div>
      ) : null}
    </ExampleCard>
  );
}

export function ExamplesGrid() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ExampleCard className="h-72">
          <div className="bg-background/90 border-border/50 absolute top-3 left-3 z-10 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md">
            SF -&gt; Monterey
          </div>
          <InView>
            <Map center={[-121.994, 37.188]} zoom={7}>
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
            10-min drive · Oakland
          </div>
          <InView>
            <Map center={oaklandCenter} zoom={11.2}>
              <IsochroneLayer center={oaklandCenter} profile="driving" minutes={10} />
              <Marker lng={oaklandCenter[0]} lat={oaklandCenter[1]}>
                <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md">
                  <Car className="size-3.5" />
                </span>
              </Marker>
            </Map>
          </InView>
        </ExampleCard>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ZipBoundariesCard />

        <PlaceholderCard
          icon={placeholders[0].icon}
          label={placeholders[0].label}
          className="h-[380px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {placeholders.slice(1).map((item) => (
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
