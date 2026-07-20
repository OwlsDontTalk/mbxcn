import { Metadata } from "next";

import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsPropTable, DocsSection } from "../_components/docs";
import { ControlsExample } from "../_components/examples/controls-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Controls",
};

export default function ControlsPage() {
  const controlsSource = getExampleSource("controls-example.tsx");

  return (
    <DocsLayout
      title="Controls"
      description="Tailwind-styled zoom and geolocate buttons overlaid on the map."
      prev={{ title: "Popup", href: "/docs/popup" }}
      next={{ title: "3D", href: "/docs/3d" }}
      toc={[
        { title: "Usage", slug: "usage" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Usage">
        <p>
          Drop <DocsCode>{"<Controls>"}</DocsCode> inside{" "}
          <DocsCode>{"<Map>"}</DocsCode>. Buttons are built on the shadcn{" "}
          <DocsCode>Button</DocsCode>, so they match your theme out of the box.
        </p>
        <ComponentPreview code={controlsSource}>
          <ControlsExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Props">
        <DocsPropTable
          props={[
            {
              name: "position",
              type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
              default: '"top-right"',
              description: "Corner to anchor the controls to.",
            },
            {
              name: "geolocate",
              type: "boolean",
              default: "true",
              description: "Show the geolocate button.",
            },
            {
              name: "className",
              type: "string",
              description: "Classes for the controls container.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
