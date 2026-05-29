import fs from "fs";
import path from "path";

const REGISTRY_DIR = path.join(process.cwd(), "src/registry");

export function getBlockFileSource(registryPath: string): string {
  const relativePath = registryPath.replace(/^src\/registry\//, "");
  const filePath = path.join(REGISTRY_DIR, relativePath);
  const source = fs.readFileSync(filePath, "utf-8");

  return source.replace(/@\/registry\/([\w-]+)/g, "@/components/ui/$1");
}
