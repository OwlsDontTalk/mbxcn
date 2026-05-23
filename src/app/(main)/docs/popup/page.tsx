import { Metadata } from "next";

import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsPropTable, DocsSection } from "../_components/docs";
import { PopupExample } from "../_components/examples/popup-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Popup",
};

export default function PopupPage() {
  const popupSource = getExampleSource("popup-example.tsx");

  return (
    <DocsLayout
      title="Popup"
      description="A popup with custom React content. Attaches to a parent Marker, or stands alone at given coordinates."
      prev={{ title: "Marker", href: "/docs/marker" }}
      next={{ title: "Controls", href: "/docs/controls" }}
      toc={[
        { title: "Usage", slug: "usage" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Usage">
        <p>
          Nest <DocsCode>{"<Popup>"}</DocsCode> inside a{" "}
          <DocsCode>{"<Marker>"}</DocsCode> and it attaches automatically —
          click the marker to toggle it. Click the marker in the example below.
        </p>
        <ComponentPreview code={popupSource}>
          <PopupExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Props">
        <p>
          When used outside a marker, pass <DocsCode>lng</DocsCode> and{" "}
          <DocsCode>lat</DocsCode> to anchor the popup directly.
        </p>
        <DocsPropTable
          props={[
            {
              name: "lng",
              type: "number",
              description:
                "Longitude. Ignored when nested inside a <Marker>.",
            },
            {
              name: "lat",
              type: "number",
              description: "Latitude. Ignored when nested inside a <Marker>.",
            },
            {
              name: "onClose",
              type: "() => void",
              description: "Called when the popup closes.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Popup content, rendered via a React portal.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
