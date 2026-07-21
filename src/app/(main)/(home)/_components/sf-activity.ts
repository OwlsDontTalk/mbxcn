/** Deterministic pseudo-random so the sample data is identical on every render. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const hotspots: [number, number, number][] = [
  [-122.3985, 37.7916, 1],
  [-122.4194, 37.7749, 0.85],
  [-122.4074, 37.7847, 0.7],
  [-122.4312, 37.7686, 0.55],
  [-122.4477, 37.7699, 0.45],
  [-122.4194, 37.7599, 0.6],
  [-122.3893, 37.7706, 0.4],
];

function gaussian(random: () => number) {
  return (random() + random() + random() + random() - 2) / 2;
}

export const activityPoints: GeoJSON.FeatureCollection = (() => {
  const random = seeded(20260721);
  const features: GeoJSON.Feature[] = [];

  for (const [lng, lat, weight] of hotspots) {
    const count = Math.round(70 * weight) + 20;
    for (let i = 0; i < count; i++) {
      features.push({
        type: "Feature",
        properties: { weight: 0.35 + random() * 0.65 },
        geometry: {
          type: "Point",
          coordinates: [
            lng + gaussian(random) * 0.012,
            lat + gaussian(random) * 0.009,
          ],
        },
      });
    }
  }

  return { type: "FeatureCollection", features };
})();

/** Corridors converging on the Financial District, used for the flow demo. */
const corridors: [number, number][][] = [
  [
    [-122.4674, 37.7684],
    [-122.4459, 37.7735],
    [-122.4232, 37.7793],
    [-122.4014, 37.7896],
  ],
  [
    [-122.4213, 37.7476],
    [-122.4185, 37.7622],
    [-122.4074, 37.7768],
    [-122.4001, 37.7902],
  ],
  [
    [-122.3855, 37.7599],
    [-122.3908, 37.7742],
    [-122.3949, 37.7842],
    [-122.3993, 37.7911],
  ],
  [
    [-122.4544, 37.7897],
    [-122.4361, 37.7935],
    [-122.4157, 37.7942],
    [-122.4008, 37.7918],
  ],
];

function sample(points: [number, number][], steps: number) {
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (points.length - 1);
    const index = Math.min(Math.floor(t), points.length - 2);
    const frac = t - index;
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    out.push([x1 + (x2 - x1) * frac, y1 + (y2 - y1) * frac]);
  }
  return out;
}

export const corridorPaths = corridors.map((points) => sample(points, 60));

export const corridorLines: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: corridorPaths.map((coordinates) => ({
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates },
  })),
};

const dotsPerCorridor = 7;

export function corridorDots(time: number): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  corridorPaths.forEach((path, corridorIndex) => {
    for (let k = 0; k < dotsPerCorridor; k++) {
      const t = (time + k / dotsPerCorridor + corridorIndex * 0.11) % 1;
      const span = (path.length - 1) * t;
      const index = Math.floor(span);
      const frac = span - index;
      const [x1, y1] = path[index];
      const [x2, y2] = path[Math.min(index + 1, path.length - 1)];
      features.push({
        type: "Feature",
        properties: { fade: Math.sin(t * Math.PI) },
        geometry: {
          type: "Point",
          coordinates: [x1 + (x2 - x1) * frac, y1 + (y2 - y1) * frac],
        },
      });
    }
  });

  return { type: "FeatureCollection", features };
}
