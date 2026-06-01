# mbxcn component roadmap

Plan for expanding the `mbxcn` registry with Mapbox-based components, installable via
`npx shadcn add`. Built on `mapbox-gl` v3 and the `useMap()` context, following the existing
`Map` / `Marker` / `Popup` / `Controls` / `store-locator` patterns.

Status: planning. To be converted into GitHub issues at the end of the session.

## Why Mapbox

Mapbox is the strongest base for this kind of component library:

- **One vector engine, everything composes.** Mapbox GL JS v3 renders 3D terrain, 3D buildings,
  globe, light presets, heatmaps, clustering, and custom GeoJSON layers in a single WebGL canvas.
  Every component we ship is just another child of one `<Map>`.
- **Design quality out of the box.** The Standard style ships realistic 3D and Day/Dusk/Dawn/Night
  light presets, so good-looking maps need zero styling work from the consumer.
- **Full kit, not just tiles.** Routing (Directions), place search (Search Box), geocoding,
  terrain, and drawing all come from the same vendor and the same token - no stitching together
  several providers.
- **Generous free tier with no card.** See below - enough for the vast majority of projects.

## What you need: a free token, not money

You do **not** pay to use these components. All you need is a free Mapbox public access token.
The free tier (50k map loads/mo, 100k directions/mo, 100k geocoding/mo, no credit card) is enough
for roughly **19 out of 20 projects** - personal sites, MVPs, demos, internal tools, most small
production apps. You only ever reach paid territory at real scale, and even then nothing is charged
without you explicitly adding a card.

### How to get a token

1. Sign up at https://account.mapbox.com/auth/signup/ (email + password, no payment details).
2. Open the account dashboard at https://account.mapbox.com/. Your **Default public token**
   (starts with `pk.`) is shown there and works immediately.
3. Optional but recommended: create a dedicated token via **Tokens -> Create a token**, keep the
   default public scopes, and add a **URL restriction** (e.g. `https://yourdomain.com/*`,
   `http://localhost:*`) so the token only works on your sites.
4. Use a **public** token (`pk.`) in the browser. Never ship a secret token (`sk.`) to the client.

### How our components consume it

- Per the existing `Map` component: pass `accessToken`, or set `NEXT_PUBLIC_MAPBOX_TOKEN` and let
  it fall back automatically.
- Document this token setup once in the registry docs so every component page can link to it
  instead of repeating it.

## Scope rule: free tier only, no payment required

We only ship functionality that runs on Mapbox's free tier without a payment method. Mapbox does
**not** require a credit card to use the free tier - every API below works on a card-less account.
The only consequence of exceeding a free limit without a card on file is account deactivation risk,
**not** silent charges. So "burns a quota but never forces payment" describes the entire roadmap.

A map style is not billed separately. The billed unit is a *map load* (initialization of a
`Map` object). Free tier: 50,000 web map loads/month, and every style is included - day/night/
satellite/landscape can be switched within a single load at no extra cost.

Two categories, both card-free, differing only in which quota they consume:

- **Map-load quota only (client-side, no separate quota):** all styles, 3D terrain, 3D buildings,
  globe projection, light presets, heatmap, clustering, GeoJSON layers, drawing (mapbox-gl-draw).
- **Separate free quota, no card required (note the quota in docs, not a "paid" warning):**
  - Directions API - routing. Free tier 100k req/mo. Used by `mapbox-gl-directions`.
  - Search Box API / Geocoding - place search and autocomplete. Free tier ~100k/mo, session-based
    (50 `/suggest` + 1 `/retrieve` = 1 session).
  - Adjacent (future, also free tier): Isochrone, Map Matching, Optimization.

Out of scope: anything that requires a paid/Enterprise plan up front (e.g. Navigation SDK
turn-by-turn at scale, premium datasets/boundaries). None of the components below need that.

## Map styles / modes

Sample style URLs (single base token, no activation needed):

- **Standard** `mapbox://styles/mapbox/standard` - vector, 3D by default, 4 light presets:
  Day / Dusk / Dawn / Night. Preferred basis for "map modes".
- **Standard Satellite** `mapbox://styles/mapbox/standard-satellite` - satellite + vector, also
  supports light presets.
- Classic (lighter, no 3D): `streets-v12`, `outdoors-v12`, `light-v11`, `dark-v11`,
  `satellite-v9`, `satellite-streets-v12`, `navigation-day-v1`, `navigation-night-v1`.

## Import strategy

We already use the shadcn registry model (copy sources into the consumer project via
`npx shadcn add`). Principles for scaling it:

1. **Base token is the default.** Style/3D/heatmap/draw/clustering/terrain/globe components ship
   as plain `registry:ui` items with no billing caveats.
2. **Quota-consuming APIs get a free-tier note, not a paywall warning.** Directions/Search/Geocoding
   are labeled "uses a separate free quota: 100k/mo, no card required" in description and docs; their
   deps go into the item's `dependencies`.
3. **Compose through `useMap()`.** New layers (heatmap, terrain, draw) are children of `<Map>`
   that read `map`/`isLoaded` from context and add/clean up source+layer in `useEffect` - the same
   pattern as `Marker`/`Popup`.

Note on current code: `Map` only swaps `light`/`dark`. For Standard modes (Day/Dusk/Dawn/Night)
and styles like satellite/outdoors, extend `styles`/`theme` to accept an arbitrary style/preset,
otherwise new components hit the hardcoded light/dark assumption.

## Component plan

### Tier 0 - extend existing (foundation) - DONE

- **`Map` (rework)** - done. Added `mapStyle` (a single fixed style URL, e.g. Standard, that
  overrides theme-based swapping) and `lightPreset` ("day"/"dusk"/"dawn"/"night", re-applied across
  style swaps via `setConfigProperty`, ignored by classic styles). Theme-based light/dark behavior
  unchanged and backward compatible. Docs page updated (Styles & Modes section + props).

### Tier 1 - base token only, high value

- **`Layer` / `GeoJSONSource`** - low-level primitive: declaratively add source+layer as a child
  of `<Map>`. Foundation for heatmap/cluster.
- **`Heatmap`** - heatmap from GeoJSON (ramp, weight, intensity as props).
- **`Cluster`** - point clustering + unclustered pins, click-to-zoom into a cluster.
- **`Terrain`** - 3D terrain (raster-dem) + sky, `exaggeration` prop.
- **`Buildings3D`** - `fill-extrusion` 3D buildings (for classic styles; Standard already has them).
- **`Globe`** - globe/mercator projection toggle + atmosphere.
- **`StyleSwitcher`** - Tailwind-styled control to pick style/mode (Day/Dusk/Dawn/Night, satellite,
  outdoors).
- **`Draw`** - wrapper over `mapbox-gl-draw`: toolbar (point/line/polygon/delete), `onChange`
  events, GeoJSON output.

### Tier 2 - separate free quota, no card required (free-tier note in docs)

- **`SearchBox`** - place autocomplete on the Search Box API, our input style (cf. `command-search`).
- **`Geocoder`** - address search + fly-to.
- **`Directions`** - route building (driving/cycling/walking), steps panel.

### Tier 3 - blocks (full scenarios, like `store-locator`)

- **`Route Planner`** - A->B search, route, and steps (Directions + SearchBox).
- **`Map Drawing Tool`** - geometry editor with GeoJSON export (Draw + panel).
- **`3D Explorer`** - terrain + buildings + globe + light-preset switcher.
- **`Heatmap Dashboard`** - heatmap/cluster with a toggle and legend.

## Suggested order

Tier 0 (`Map` modes) -> `Layer`/`Heatmap`/`Cluster` -> `Terrain`/`Globe`/`StyleSwitcher` ->
`Draw` -> billed `SearchBox`/`Directions` -> blocks.

## References

- Mapbox Standard Style (light presets): https://docs.mapbox.com/map-styles/standard/guides/
- Map Styles - Mapbox GL JS: https://docs.mapbox.com/mapbox-gl-js/guides/styles/
- Add 3D terrain: https://docs.mapbox.com/mapbox-gl-js/example/add-terrain/
- Display buildings in 3D: https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
- Migrate to GL JS v3 (globe, 3D, lights): https://docs.mapbox.com/mapbox-gl-js/guides/migrate-to-v3/
- Create a heatmap layer: https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
- mapbox-gl-draw: https://github.com/mapbox/mapbox-gl-draw
- mapbox-gl-directions: https://github.com/mapbox/mapbox-gl-directions
- Search Box API: https://docs.mapbox.com/api/search/search-box/
- Pricing / free tier: https://docs.mapbox.com/mapbox-gl-js/guides/pricing/
