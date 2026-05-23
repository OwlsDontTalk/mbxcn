import Link from "next/link";
import { type CSSProperties } from "react";

import { Footer } from "@/components/footer";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ExamplesGrid } from "./_components/examples-grid";

export default function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Mapbox components for React</PageHeaderHeading>
        <PageHeaderDescription>
          Customizable Mapbox GL components.
          <br className="hidden sm:block" />
          Built on Mapbox GL JS. Styled with Tailwind. Works with shadcn/ui.
        </PageHeaderDescription>
        <PageActions>
          <Button size="lg" asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/blocks">Browse Blocks</Link>
          </Button>
        </PageActions>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-center text-sm">
          We work in Mapbox every day. mbxcn is the component set we kept
          rebuilding from project to project — packaged so you can drop it in
          with one shadcn command.
        </p>
      </PageHeader>

      <section
        className="animate-fade-up animate-stagger container pt-4"
        style={{ "--stagger": 4 } as CSSProperties}
      >
        <ExamplesGrid />
      </section>

      <Footer />
    </>
  );
}
