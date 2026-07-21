/** Deterministic pseudo-random so the sample data is identical on every render. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Rough San Francisco shoreline. Points are rejection-sampled against it so the
// scatter never lands in the bay or the ocean.
const sfLand: [number, number][] = [
  [-122.513, 37.78],
  [-122.478, 37.81],
  [-122.447, 37.811],
  [-122.404, 37.81],
  [-122.386, 37.792],
  [-122.389, 37.777],
  [-122.377, 37.764],
  [-122.382, 37.74],
  [-122.39, 37.72],
  [-122.4, 37.708],
  [-122.508, 37.708],
  [-122.514, 37.735],
];

function onLand([x, y]: [number, number]) {
  let inside = false;
  for (let i = 0, j = sfLand.length - 1; i < sfLand.length; j = i++) {
    const [xi, yi] = sfLand[i];
    const [xj, yj] = sfLand[j];
    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

// A few dense cores, mid-density districts, and a sparse scatter across the
// city. Without the tail the heatmap saturates and every cell reads as the top
// colour of the ramp.
const cores: [number, number, number, number][] = [
  [-122.3985, 37.7916, 1, 0.004],
  [-122.4194, 37.7749, 0.8, 0.005],
  [-122.4074, 37.7847, 0.62, 0.006],
  [-122.4312, 37.7686, 0.4, 0.008],
  [-122.4477, 37.7699, 0.3, 0.009],
  [-122.4194, 37.7599, 0.45, 0.007],
  [-122.3893, 37.7706, 0.28, 0.01],
];

function gaussian(random: () => number) {
  return (random() + random() + random() + random() - 2) / 2;
}

export const activityPoints: GeoJSON.FeatureCollection = (() => {
  const random = seeded(20260721);
  const features: GeoJSON.Feature[] = [];

  const push = (lng: number, lat: number, weight: number) => {
    if (!onLand([lng, lat])) return false;
    features.push({
      type: "Feature",
      properties: { weight },
      geometry: { type: "Point", coordinates: [lng, lat] },
    });
    return true;
  };

  for (const [lng, lat, strength, spread] of cores) {
    const target = Math.round(90 * strength) + 12;
    let placed = 0;
    for (let attempt = 0; attempt < target * 6 && placed < target; attempt++) {
      const ok = push(
        lng + gaussian(random) * spread * 3,
        lat + gaussian(random) * spread * 2.2,
        0.5 + random() * 0.5,
      );
      if (ok) placed++;
    }
  }

  let scattered = 0;
  for (let attempt = 0; attempt < 3000 && scattered < 260; attempt++) {
    const ok = push(
      -122.514 + random() * 0.137,
      37.708 + random() * 0.103,
      0.15 + random() * 0.35,
    );
    if (ok) scattered++;
  }

  return { type: "FeatureCollection", features };
})();
