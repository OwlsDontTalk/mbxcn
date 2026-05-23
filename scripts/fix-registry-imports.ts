import fs from "fs";
import path from "path";

const REGISTRY_DIR = path.join(process.cwd(), "public", "r");
// Rewrite cross-component imports (`@/registry/<name>`) to where the shadcn CLI
// installs them in the consumer's project (`@/components/ui/<name>`).
const REGISTRY_IMPORT = /@\/registry\/([\w-]+)/g;

interface RegistryFile {
  path: string;
  content?: string;
  type?: string;
  target?: string;
}

interface RegistryItem {
  files?: RegistryFile[];
}

interface RegistryData {
  files?: RegistryFile[];
  items?: RegistryItem[];
}

function fixContent(content: string): string {
  return content.replace(REGISTRY_IMPORT, "@/components/ui/$1");
}

function processFile(filePath: string): void {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as RegistryData;
  let changed = false;

  if (Array.isArray(data.files)) {
    for (const file of data.files) {
      if (file.content?.includes("@/registry/")) {
        file.content = fixContent(file.content);
        changed = true;
      }
    }
  }

  if (Array.isArray(data.items)) {
    for (const item of data.items) {
      if (Array.isArray(item.files)) {
        for (const file of item.files) {
          if (file.content?.includes("@/registry/")) {
            file.content = fixContent(file.content);
            changed = true;
          }
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log("Fixed imports in:", path.relative(process.cwd(), filePath));
  }
}

const files = fs.readdirSync(REGISTRY_DIR).filter((f) => f.endsWith(".json"));
for (const f of files) {
  processFile(path.join(REGISTRY_DIR, f));
}
