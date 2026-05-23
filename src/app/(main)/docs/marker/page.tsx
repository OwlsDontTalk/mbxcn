import { Metadata } from "next";

import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsPropTable, DocsSection } from "../_components/docs";
import { MarkerExample } from "../_components/examples/marker-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Marker",
};

export default function MarkerPage() {
  const markerSource = getExampleSource("marker-example.tsx");

  return (
    <DocsLayout
      title="Marker"
      description="Place a marker at given coordinates. Renders the default pin, or your own content as a custom pin."
      prev={{ title: "Map", href: "/docs/map" }}
      next={{ title: "Popup", href: "/docs/popup" }}
      toc={[
        { title: "Usage", slug: "usage" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Usage">
        <p>
          Render <DocsCode>{"<Marker>"}</DocsCode> as a child of{" "}
          <DocsCode>{"<Map>"}</DocsCode>. Pass children to use them as a custom
          pin; omit them for the default Mapbox marker.
        </p>
        <ComponentPreview code={markerSource}>
          <MarkerExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Props">
        <DocsPropTable
          props={[
            {
              name: "lng",
              type: "number",
              description: "Longitude of the marker.",
            },
            {
              name: "lat",
              type: "number",
              description: "Latitude of the marker.",
            },
            {
              name: "onClick",
              type: "(marker: mapboxgl.Marker) => void",
              description: "Called when the marker element is clicked.",
            },
            {
              name: "children",
              type: "ReactNode",
              description:
                "Custom pin content. A nested <Popup> renders nothing here, so the marker falls back to the default pin.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
