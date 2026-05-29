import { Metadata } from "next";

import { CodeBlock } from "../_components/code-block";
import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsNote, DocsPropTable, DocsSection } from "../_components/docs";
import { BasicMapExample } from "../_components/examples/basic-map-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Map",
};

export default function MapPage() {
  const basicMapSource = getExampleSource("basic-map-example.tsx");

  return (
    <DocsLayout
      title="Map"
      description="The map container. Handles Mapbox GL setup, light/dark theming, and provides context for child components."
      prev={{ title: "Introduction", href: "/docs" }}
      next={{ title: "Marker", href: "/docs/marker" }}
      toc={[
        { title: "Basic Usage", slug: "basic-usage" },
        { title: "Theming", slug: "theming" },
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
