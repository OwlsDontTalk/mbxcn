import { DocsLayout, DocsSection, DocsLink } from "./_components/docs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introduction",
};

export default function IntroductionPage() {
  return (
    <DocsLayout
      title="Introduction"
      description="Copy-paste Mapbox GL components for React."
      toc={[
        { title: "What is mbxcn?", slug: "what-is-mbxcn" },
        { title: "Status", slug: "status" },
      ]}
    >
      <DocsSection title="What is mbxcn?">
        <p>
          <strong>mbxcn</strong> is a registry of Mapbox GL components for
          React. It follows the{" "}
          <DocsLink href="https://ui.shadcn.com" external>
            shadcn/ui
          </DocsLink>{" "}
          model: components live in your codebase, installed via the shadcn
          CLI, owned by you.
        </p>
        <p>
          Built on{" "}
          <DocsLink href="https://docs.mapbox.com/mapbox-gl-js/" external>
            Mapbox GL JS
          </DocsLink>
          , styled with{" "}
          <DocsLink href="https://tailwindcss.com" external>
            Tailwind CSS
          </DocsLink>
          .
        </p>
      </DocsSection>

      <DocsSection title="Status">
        <p>Early. Components and docs are landing soon.</p>
      </DocsSection>
    </DocsLayout>
  );
}
