import { Metadata } from "next";

import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsPropTable, DocsSection } from "../_components/docs";
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
                "Basemap theme. Auto-detected from the document class when omitted.",
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
