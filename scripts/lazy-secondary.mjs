import { existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rawDataDir = resolve("data/raw-json");
const cacheDir = resolve("data/cache");

function main() {
  const started = new Date().toISOString();
  mkdirSync(cacheDir, { recursive: true });

  if (!existsSync(rawDataDir)) {
    const manifest = { generatedAt: started, status: "no-data", files: [] };
    writeFileSync(resolve(cacheDir, "index.json"), JSON.stringify(manifest, null, 2));
    console.log("[lazy:secondary] data/raw-json no existe; manifest vacío escrito");
    return;
  }

  const files = readdirSync(rawDataDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const p = resolve(rawDataDir, f);
      const s = statSync(p);
      return { file: f, size: s.size, mtime: s.mtime.toISOString() };
    });

  const manifest = { generatedAt: started, status: "ok", files };
  writeFileSync(resolve(cacheDir, "index.json"), JSON.stringify(manifest, null, 2));

  if (files.length === 0) {
    console.log("[lazy:secondary] data/raw-json vacío; manifest de cache escrito");
    return;
  }
  console.log(`[lazy:secondary] indexados ${files.length} JSON -> data/cache/index.json`);
}

main();
