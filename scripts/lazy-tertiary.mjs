import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sources = ["data/raw-json", "data/combined-json"];
const cacheDir = resolve("data/cache");

function main() {
  const started = new Date().toISOString();
  mkdirSync(cacheDir, { recursive: true });

  const aggregates = { generatedAt: started, sources: {} };
  let anyData = false;

  for (const dir of sources) {
    const abs = resolve(dir);
    if (!existsSync(abs)) continue;
    const files = readdirSync(abs).filter((f) => f.endsWith(".json"));
    if (files.length === 0) continue;

    anyData = true;
    aggregates.sources[dir] = {};
    for (const f of files) {
      try {
        const parsed = JSON.parse(readFileSync(resolve(abs, f), "utf8"));
        const keys = Array.isArray(parsed) ? [] : Object.keys(parsed);
        aggregates.sources[dir][f] = {
          bytes: readFileSync(resolve(abs, f), "utf8").length,
          topLevelKeys: keys,
        };
      } catch {
        aggregates.sources[dir][f] = { error: "invalid-json" };
      }
    }
  }

  writeFileSync(resolve(cacheDir, "aggregates.json"), JSON.stringify(aggregates, null, 2));

  if (!anyData) {
    console.log("[lazy:tertiary] sin datos para agregar; aggregates vacío escrito");
    return;
  }
  console.log("[lazy:tertiary] agregados escritos en data/cache/aggregates.json");
}

main();
