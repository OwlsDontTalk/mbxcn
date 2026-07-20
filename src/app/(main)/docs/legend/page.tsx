import { Metadata } from "next";

import { CodeBlock } from "../_components/code-block";
import {
  DocsCode,
  DocsLayout,
  DocsNote,
  DocsPropTable,
  DocsSection,
} from "../_components/docs";

export const metadata: Metadata = {
  title: "Legend",
};

export default function LegendPage() {
  return (
    <DocsLayout
      title="Legend"
      description="A legend rendered from the same ramp object that colours the map."
      prev={{ title: "Choropleth", href: "/docs/choropleth" }}
      next={{ title: "3D", href: "/docs/3d" }}
      toc={[
        { title: "Usage", slug: "usage" },
        { title: "Why Share the Ramp", slug: "why-share-the-ramp" },
        { title: "Props", slug: "props" },
      ]}
    >
      <DocsSection title="Usage">
        <p>
          Define the ramp once and hand it to both components. The legend on the{" "}
          <DocsCode>Choropleth</DocsCode> page is this component.
        </p>
        <CodeBlock
          code={`const ramp: ChoroplethRamp = {
  kind: "step",
  breaks: [7, 12, 17],
  colors: ["#eef2f6", "#ccd6e0", "#9fb1c2", "#6d859c"],
};

<Choropleth id="zips" data={zips} value="area" ramp={ramp} featureId="zip" />
<Legend ramp={ramp} title="ZIP area · km²" />`}
        />
        <p>
          All three ramp kinds render: <DocsCode>step</DocsCode> as labelled
          bands, <DocsCode>linear</DocsCode> as a gradient bar with its bounds,
          and <DocsCode>categorical</DocsCode> as a swatch list.
        </p>
        <p>
          Pass <DocsCode>activeValue</DocsCode> - typically the value of the
          hovered feature - and the matching band is emphasised, so the legend
          doubles as a readout.
        </p>
      </DocsSection>

      <DocsSection title="Why Share the Ramp">
        <p>
          The usual way to build a legend is to write the colours a second time,
          as a CSS gradient or a list of swatches. Then someone tunes the map
          palette, forgets the legend, and the two quietly disagree - the map
          says one thing, the key says another.
        </p>
        <DocsNote>
          This is not hypothetical. In the production codebase this library was
          drawn from, one brand ramp was encoded five different ways across the
          same repo, and legends had drifted from the layers they described.
        </DocsNote>
        <p>
          Because <DocsCode>Legend</DocsCode> reads the ramp object rather than a
          copy of its colours, and{" "}
          <DocsCode>Choropleth</DocsCode> compiles the same object into its paint
          expression, the two cannot disagree. Change a colour in one place and
          both follow.
        </p>
      </DocsSection>

      <DocsSection title="Props">
        <DocsPropTable
          props={[
            {
              name: "ramp",
              type: "ChoroplethRamp",
              description:
                "The same object passed to Choropleth. step, linear or categorical.",
            },
            {
              name: "title",
              type: "string",
              description: "Optional caption above the swatches.",
            },
            {
              name: "activeValue",
              type: "number | null",
              description:
                "Emphasise the band this value falls into. Step ramps only.",
            },
            {
              name: "format",
              type: "(value: number) => string",
              default: "String",
              description: "Format numeric bounds in the labels.",
            },
            {
              name: "className",
              type: "string",
              description: "Classes for the container, e.g. absolute placement.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
