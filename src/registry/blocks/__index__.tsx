import React from "react";

import { RegistryBlockItem } from "@/lib/blocks";

export const blockComponents: Record<
  RegistryBlockItem["name"],
  React.LazyExoticComponent<React.ComponentType<object>>
> = {
  "store-locator": React.lazy(() => import("./store-locator/page")),
};
