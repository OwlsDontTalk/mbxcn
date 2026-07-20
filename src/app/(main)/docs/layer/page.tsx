import { Metadata } from "next";

import { CodeBlock } from "../_components/code-block";
import { ComponentPreview } from "../_components/component-preview";
import {
  DocsCode,
  DocsLayout,
  DocsNote,
  DocsPropTable,
  DocsSection,
} from "../_components/docs";
import { LayerExample } from "../_components/examples/layer-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Layer",
};

export default function LayerPage() {
  const layerSource = getExampleSource("layer-example.tsx");

  return (
    <DocsLayout
      title="Layer"
      description="Declaratively add a GeoJSON source and a styled layer as a child of the map."
      prev={{ title: "Controls", href: "/docs/controls" }}
      next={{ title: "3D", href: "/docs/3d" }}
      toc={[
        { title: "Usage", slug: "usage" },
        { title: "Sharing a Source", slug: "sharing-a-source" },
        { title: "Hover and Hit Layers", slug: "hover-and-hit-layers" },
        { title: "Updates", slug: "updates" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Usage">
        <p>
          <DocsCode>{"<Layer>"}</DocsCode> owns a GeoJSON source and the layer
          drawn from it. Give it <DocsCode>data</DocsCode>, a layer{" "}
          <DocsCode>type</DocsCode>, and the usual Mapbox{" "}
          <DocsCode>paint</DocsCode> spec - data-driven expressions work exactly
          as they do in Mapbox GL.
        </p>
        <p>
          The example below draws ZIP boundaries over Denver and reports the code
          under the cursor. Its <DocsCode>data</DocsCode> is a URL rather than an
          object, so Mapbox fetches the GeoJSON itself and the geometry never
          enters your bundle.
        </p>
        <ComponentPreview code={layerSource}>
          <LayerExample />
        </ComponentPreview>
        <p>
          Everything here is the plain Mapbox style spec, so anything you can
          express in a Mapbox <DocsCode>paint</DocsCode> or{" "}
          <DocsCode>layout</DocsCode> block works unchanged. The component only
          manages the lifecycle.
        </p>
      </DocsSection>

      <DocsSection title="Sharing a Source">
        <p>
          Layers are usually paired - a fill plus its outline. Point the second
          layer at the first with <DocsCode>source</DocsCode> instead of passing{" "}
          <DocsCode>data</DocsCode> twice:
        </p>
        <CodeBlock
          code={`<Layer id="zips" type="fill" data={zips} paint={{ "fill-color": "#60a5fa" }} />
<Layer id="zips-outline" type="line" source="zips" paint={{ "line-color": "#1e3a8a" }} />`}
        />
        <p>
          A layer that names an existing <DocsCode>source</DocsCode> never
          creates or removes one, so the source outlives it.
        </p>
      </DocsSection>

      <DocsSection title="Hover and Hit Layers">
        <p>
          A hairline border is almost impossible to hit with a cursor. The usual
          fix is a transparent <DocsCode>fill</DocsCode> over the same source
          that exists purely to catch pointer events, with the visible outline
          drawn on top:
        </p>
        <CodeBlock
          code={`<Layer id="zips-hit" type="fill" data={zips}
  paint={{ "fill-color": "#000", "fill-opacity": 0 }} />
<Layer id="zips-border" type="line" source="zips-hit"
  paint={{ "line-color": "#3b82f6", "line-width": 0.7 }} />`}
        />
        <p>
          A fully transparent fill is still rendered geometry, so Mapbox&apos;s
          layer-scoped events fire on it. Subscribe through{" "}
          <DocsCode>useMap()</DocsCode> and read the feature from the event:
        </p>
        <CodeBlock
          code={`const { map } = useMap();

useEffect(() => {
  if (!map) return;
  const move = (e) => setHovered(e.features?.[0]?.properties ?? null);
  map.on("mousemove", "zips-hit", move);
  return () => map.off("mousemove", "zips-hit", move);
}, [map]);`}
        />
        <p>
          To highlight the hovered feature, point a third layer at the same
          source and drive its <DocsCode>filter</DocsCode> from state.{" "}
          <DocsCode>filter</DocsCode> is applied with{" "}
          <DocsCode>setFilter</DocsCode>, so this costs nothing per frame.
        </p>
      </DocsSection>

      <DocsSection title="Updates">
        <p>
          Changing <DocsCode>data</DocsCode> calls{" "}
          <DocsCode>setData</DocsCode> on the existing source rather than
          rebuilding the layer, so animations and transitions stay smooth. Pass a
          stable reference - wrap inline objects in{" "}
          <DocsCode>useMemo</DocsCode> so a re-render alone does not push data.
        </p>
        <p>
          <DocsCode>paint</DocsCode>, <DocsCode>layout</DocsCode> and{" "}
          <DocsCode>filter</DocsCode> are compared by value and applied per
          property, so inline objects are safe there.
        </p>
        <DocsNote>
          <strong>Style swaps are handled.</strong>{" "}
          <DocsCode>map.setStyle()</DocsCode> drops every user source and layer -
          which is what happens when the site theme changes. This component
          re-adds itself on each new style, so your data survives a light/dark
          toggle without any work on your side.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Props">
        <p>
          Every other property of the Mapbox layer spec for the given{" "}
          <DocsCode>type</DocsCode> - <DocsCode>filter</DocsCode>,{" "}
          <DocsCode>minzoom</DocsCode>, <DocsCode>maxzoom</DocsCode>,{" "}
          <DocsCode>slot</DocsCode> - is passed straight through and typed per
          layer type.
        </p>
        <DocsPropTable
          props={[
            {
              name: "id",
              type: "string",
              description:
                "Unique layer id. Also names the source this layer creates.",
            },
            {
              name: "type",
              type: '"fill" | "line" | "circle" | "symbol" | "heatmap" | "fill-extrusion" | ...',
              description: "Any Mapbox layer type.",
            },
            {
              name: "data",
              type: "GeoJSON | string",
              description:
                "GeoJSON object or a URL. The layer creates and owns a source for it.",
            },
            {
              name: "source",
              type: "string",
              description:
                "Use an existing source instead of creating one. Takes precedence over data.",
            },
            {
              name: "sourceOptions",
              type: "object",
              description:
                "Extra source options, such as cluster, promoteId or generateId.",
            },
            {
              name: "paint",
              type: "object",
              description:
                "Mapbox paint spec for the layer type. Applied per property on change.",
            },
            {
              name: "layout",
              type: "object",
              description: "Mapbox layout spec for the layer type.",
            },
            {
              name: "beforeId",
              type: "string",
              description:
                "Insert this layer below another. Ignored when that layer is absent.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
