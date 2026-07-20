import { Metadata } from "next";

import { CodeBlock } from "../_components/code-block";
import { ComponentPreview } from "../_components/component-preview";
import { DocsCode, DocsLayout, DocsNote, DocsSection } from "../_components/docs";
import { Standard3DExample } from "../_components/examples/standard-3d-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "3D",
};

export default function ThreeDPage() {
  const standard3dSource = getExampleSource("standard-3d-example.tsx");

  return (
    <DocsLayout
      title="3D"
      description="The Mapbox Standard style renders 3D buildings, landmarks, and trees with dynamic lighting - no styling work required."
      prev={{ title: "Controls", href: "/docs/controls" }}
      toc={[
        { title: "Standard 3D", slug: "standard-3d" },
        { title: "Light Presets", slug: "light-presets" },
        { title: "Loading", slug: "loading" },
        { title: "Performance", slug: "performance" },
      ]}
    >
      <DocsSection title="Standard 3D">
        <p>
          Point <DocsCode>mapStyle</DocsCode> at the Standard style and you get
          extruded buildings, landmark meshes, 3D trees, and terrain out of the
          box. Add <DocsCode>pitch</DocsCode> to actually see them.
        </p>
        <ComponentPreview code={standard3dSource}>
          <Standard3DExample />
        </ComponentPreview>
        <p>
          The camera above is deliberately constrained - a narrow zoom range and
          a <DocsCode>maxBounds</DocsCode> box - so the map can be nudged but not
          flung across the world or zoomed deep into heavy landmark geometry.
        </p>
      </DocsSection>

      <DocsSection title="Light Presets">
        <p>
          Standard ships four light presets. They change colour temperature,
          shadow direction, and lighting intensity across the whole map:
        </p>
        <CodeBlock
          code={`<Map
  mapStyle="mapbox://styles/mapbox/standard"
  lightPreset="dusk"
  pitch={52}
/>`}
        />
        <p>
          A common pattern is to drive the preset from the clock - dawn 6-8, day
          8-17, dusk 17-20, night otherwise - or simply from your site theme.
        </p>
      </DocsSection>

      <DocsSection title="Loading">
        <p>
          A 3D basemap is heavy: it pulls building geometry, landmark meshes, and
          terrain before the first frame looks right.{" "}
          <DocsCode>{"<Map>"}</DocsCode> handles this for you - children are only
          rendered once the map has loaded, and a spinner overlay covers the
          container until then.
        </p>
        <p>
          Pass <DocsCode>loader</DocsCode> to supply your own overlay, or{" "}
          <DocsCode>false</DocsCode> to opt out entirely:
        </p>
        <CodeBlock
          code={`<Map
  mapStyle="mapbox://styles/mapbox/standard"
  loader={<MySkeleton />}
/>`}
        />
      </DocsSection>

      <DocsSection title="Performance">
        <p>
          Keep heavy 3D on pages where the visitor has opted into it. A Standard
          3D map is the most expensive thing on any page it appears on, so
          mounting one eagerly above the fold - or several at once - is the
          fastest way to make a site feel slow.
        </p>
        <DocsNote>
          <strong>Rule of thumb:</strong> one 3D map per page, mounted only when
          it scrolls into view, behind a loader. Everywhere else, prefer a flat
          style like <DocsCode>light-v11</DocsCode> and let the data be the thing
          that impresses.
        </DocsNote>
        <p>
          Cost is not a reason to avoid it: switching styles or light presets
          within a session does not spend extra map loads, and 3D is included on
          the free tier like everything else.
        </p>
      </DocsSection>
    </DocsLayout>
  );
}
