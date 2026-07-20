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
import { ChoroplethExample } from "../_components/examples/choropleth-example";
import { getExampleSource } from "../_components/get-example-source";

export const metadata: Metadata = {
  title: "Choropleth",
};

export default function ChoroplethPage() {
  const source = getExampleSource("choropleth-example.tsx");

  return (
    <DocsLayout
      title="Choropleth"
      description="Regions coloured by a data value, with outlines and hover highlighting."
      prev={{ title: "Layer", href: "/docs/layer" }}
      next={{ title: "Legend", href: "/docs/legend" }}
      toc={[
        { title: "Usage", slug: "usage" },
        { title: "Ramps", slug: "ramps" },
        { title: "Hover", slug: "hover" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Usage">
        <p>
          <DocsCode>{"<Choropleth>"}</DocsCode> builds on{" "}
          <DocsCode>{"<Layer>"}</DocsCode>: give it polygons, the property to
          colour by, and a ramp. It renders the fill, the borders, and the hover
          highlight for you.
        </p>
        <ComponentPreview code={source}>
          <ChoroplethExample />
        </ComponentPreview>
      </DocsSection>

      <DocsSection title="Ramps">
        <p>
          A ramp is a plain object, not an expression. That matters: the same
          object drives the paint expression and{" "}
          <DocsCode>{"<Legend>"}</DocsCode>, so the swatches can never drift
          from the colours actually on the map.
        </p>
        <CodeBlock
          code={`const ramp: ChoroplethRamp = {
  kind: "step",
  breaks: [7, 12, 17],
  colors: ["#eef2f6", "#ccd6e0", "#9fb1c2", "#6d859c"],
};`}
        />
        <p>Three kinds are supported:</p>
        <CodeBlock
          code={`{ kind: "step", breaks: [10, 20], colors: ["#eee", "#88f", "#00a"] }
{ kind: "linear", stops: [[0, "#eee"], [100, "#00a"]] }
{ kind: "categorical", values: [["a", "#f00"], ["b", "#0f0"]], fallback: "#ccc" }`}
        />
        <DocsNote>
          <strong>Prefer <DocsCode>step</DocsCode> for skewed data.</strong> Real
          world values are rarely evenly spread - a linear ramp over areas or
          populations collapses most features into one shade. Quantile breaks
          with <DocsCode>step</DocsCode> keep the map readable.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Hover">
        <p>
          Hover highlighting uses Mapbox{" "}
          <DocsCode>feature-state</DocsCode>, which needs a stable feature id.
          GeoJSON features rarely carry one, so name the property that holds it
          with <DocsCode>featureId</DocsCode>:
        </p>
        <CodeBlock
          code={`<Choropleth id="zips" data={zips} value="area" ramp={ramp} featureId="zip" />`}
        />
        <p>
          This is set as <DocsCode>promoteId</DocsCode> on the source. The
          highlight is then pure GPU state - no re-render, no{" "}
          <DocsCode>setData</DocsCode>, nothing recomputed per frame. Omit{" "}
          <DocsCode>featureId</DocsCode> and highlighting turns off, though{" "}
          <DocsCode>onHover</DocsCode> and <DocsCode>onSelect</DocsCode> still
          fire.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <DocsPropTable
          props={[
            {
              name: "id",
              type: "string",
              description: "Names the source and the layers derived from it.",
            },
            {
              name: "data",
              type: "GeoJSON | string",
              description: "GeoJSON object or a URL.",
            },
            {
              name: "value",
              type: "string | Expression",
              description:
                "Property name to colour by, or a full Mapbox expression.",
            },
            {
              name: "ramp",
              type: "ChoroplethRamp",
              description:
                "Colour scale: step, linear or categorical. Share it with Legend.",
            },
            {
              name: "featureId",
              type: "string",
              description:
                "Property holding a stable id. Required for hover highlighting.",
            },
            {
              name: "opacity",
              type: "number",
              default: "0.75",
              description: "Fill opacity. Hovered features get a slight bump.",
            },
            {
              name: "outline",
              type: "boolean | { color?, width? }",
              default: "true",
              description: "Borders between features.",
            },
            {
              name: "hover",
              type: "boolean",
              default: "true",
              description: "Highlight the feature under the cursor.",
            },
            {
              name: "onHover / onSelect",
              type: "(feature, event) => void",
              description:
                "Fired on mousemove and click. onHover receives null on leave.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
