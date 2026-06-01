import { Metadata } from "next";

import { CodeBlock } from "../_components/code-block";
import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsNote, DocsPropTable, DocsSection } from "../_components/docs";
import { BasicMapExample } from "../_components/examples/basic-map-example";
import { MapModesExample } from "../_components/examples/map-modes-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Map",
};

export default function MapPage() {
  const basicMapSource = getExampleSource("basic-map-example.tsx");
  const mapModesSource = getExampleSource("map-modes-example.tsx");

  return (
    <DocsLayout
      title="Map"
      description="The map container. Handles Mapbox GL setup, light/dark theming, Standard styles, and provides context for child components."
      prev={{ title: "Introduction", href: "/docs" }}
      next={{ title: "Marker", href: "/docs/marker" }}
      toc={[
        { title: "Basic Usage", slug: "basic-usage" },
        { title: "Theming", slug: "theming" },
        { title: "Styles & Modes", slug: "styles-modes" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Basic Usage">
        <p>
          Wrap your map in <DocsCode>{"<Map>"}</DocsCode>. It reads your token
          from <DocsCode>NEXT_PUBLIC_MAPBOX_TOKEN</DocsCode> and follows the
          document theme automatically.
        </p>
        <ComponentPreview code={basicMapSource}>
          <BasicMapExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Theming">
        <p>
          By default <DocsCode>{"<Map>"}</DocsCode> follows your site theme: it
          watches the <DocsCode>light</DocsCode> / <DocsCode>dark</DocsCode>{" "}
          class on <DocsCode>{"<html>"}</DocsCode> (the one{" "}
          <DocsCode>next-themes</DocsCode> toggles) and swaps the basemap live.
          No configuration needed.
        </p>
        <p>
          To pin the basemap to a fixed theme and stop it reacting to site theme
          changes, pass <DocsCode>theme</DocsCode>:
        </p>
        <CodeBlock code={`<Map theme="dark" />`} />
        <p>
          To change which Mapbox style each theme maps to, pass{" "}
          <DocsCode>styles</DocsCode>:
        </p>
        <CodeBlock
          code={`<Map
  styles={{
    light: "mapbox://styles/mapbox/streets-v12",
    dark: "mapbox://styles/mapbox/dark-v11",
  }}
/>`}
        />
        <DocsNote>
          <strong>Heads up:</strong> a pinned <DocsCode>theme</DocsCode> is the
          off switch for automatic theme following - the map will ignore the
          document theme entirely until you remove it.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Styles & Modes">
        <p>
          Theme switching is for light/dark basemaps. To pin a single fixed
          style regardless of theme - including the 3D{" "}
          <DocsCode>Standard</DocsCode> style - pass{" "}
          <DocsCode>mapStyle</DocsCode>. It takes precedence over{" "}
          <DocsCode>theme</DocsCode> / <DocsCode>styles</DocsCode> and turns off
          automatic swapping.
        </p>
        <CodeBlock code={`<Map mapStyle="mapbox://styles/mapbox/standard" />`} />
        <p>
          The <DocsCode>Standard</DocsCode> style ships four light presets -{" "}
          <DocsCode>day</DocsCode>, <DocsCode>dusk</DocsCode>,{" "}
          <DocsCode>dawn</DocsCode>, <DocsCode>night</DocsCode>. Set one with{" "}
          <DocsCode>lightPreset</DocsCode>; it is re-applied across style swaps
          and ignored by classic styles that don&apos;t expose it.
        </p>
        <p>
          Here it is live - the buttons swap <DocsCode>lightPreset</DocsCode> on
          the same map:
        </p>
        <ComponentPreview code={mapModesSource}>
          <MapModesExample />
        </ComponentPreview>
        <DocsNote>
          <strong>Token note:</strong> every style here works on the free
          Mapbox tier with a public token - no payment required. Switching
          styles or presets within a session does not cost extra map loads.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Props">
        <p>
          Any other{" "}
          <DocsCode>mapboxgl.MapOptions</DocsCode> (such as{" "}
          <DocsCode>center</DocsCode>, <DocsCode>zoom</DocsCode>,{" "}
          <DocsCode>pitch</DocsCode>) are passed straight to the map.
        </p>
        <DocsPropTable
          props={[
            {
              name: "theme",
              type: '"light" | "dark"',
              description:
                "Basemap theme. Follows the document theme when omitted; set it to pin a theme and disable automatic switching.",
            },
            {
              name: "styles",
              type: "{ light?: string; dark?: string }",
              description: "Override the default Mapbox styles per theme.",
            },
            {
              name: "mapStyle",
              type: "string",
              description:
                "A single fixed style URL. Overrides theme/styles and disables automatic swapping.",
            },
            {
              name: "lightPreset",
              type: '"day" | "dusk" | "dawn" | "night"',
              description:
                "Light preset for the Standard style. Ignored by styles without one.",
            },
            {
              name: "accessToken",
              type: "string",
              default: "NEXT_PUBLIC_MAPBOX_TOKEN",
              description: "Mapbox access token.",
            },
            {
              name: "className",
              type: "string",
              description: "Classes for the map container.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
