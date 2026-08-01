// upload-blob.mjs — Descarga las imágenes curadas del seed 005, las sube al bucket
// público "images" de Supabase Storage y actualiza image_url en places/businesses/
// events/routes para apuntar a la URL pública (sin dependencias, usa fetch nativo).
//
// Uso:  node scripts/upload-blob.mjs

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "images";

// ---------- util ----------
function parseEnvFile(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)="?(.+?)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function envFileName(url) {
  const clean = url.split("?")[0];
  const m = clean.match(/\.(jpe?g|png|webp|avif|gif)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

// ---------- config ----------
const env = parseEnvFile(
  readFileSync(path.join(root, "apps", "rdm-hub", ".env.local"), "utf8"),
);
const SUPABASE_URL =
  env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.POSTGRES_PASSWORD_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("ERROR: faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${SERVICE_KEY}`,
  apikey: SERVICE_KEY,
};

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (!res.ok && res.status !== 400 && res.status !== 409) {
    console.error("ensureBucket falló:", res.status, await res.text());
    process.exit(1);
  }
  console.log(`Bucket '${BUCKET}' listo`);
}

async function uploadImage(url) {
  const imgRes = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!imgRes.ok) throw new Error(`descarga ${url} -> ${imgRes.status}`);
  const data = await imgRes.arrayBuffer();
  const ext = envFileName(url);
  const name = `${createHash("sha1").update(url).digest("hex").slice(0, 16)}.${ext}`;

  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "image/jpeg", "x-upsert": "true" },
    body: new Uint8Array(data),
  });
  if (!up.ok) throw new Error(`upload ${name} -> ${up.status} ${await up.text()}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`;
}

async function patchRow(table, id, publicUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ image_url: publicUrl }),
  });
  if (!res.ok) throw new Error(`PATCH ${table}/${id} -> ${res.status} ${await res.text()}`);
}

// ---------- main ----------
const seed = readFileSync(path.join(root, "data", "seed", "005_images.sql"), "utf8");
const rows = [
  ...seed.matchAll(
    /UPDATE\s+(\w+)\s+SET\s+image_url\s*=\s*'([^']+)'\s+WHERE\s+id\s*=\s*'([^']+)'/gi,
  ),
].map((m) => ({ table: m[1].toLowerCase(), url: m[2], id: m[3] }));

console.log(`Filas a actualizar: ${rows.length}`);

await ensureBucket();

const byUrl = new Map();
for (const { url } of rows) {
  if (!byUrl.has(url)) {
    const publicUrl = await uploadImage(url);
    byUrl.set(url, publicUrl);
    console.log(`  subida ${url.split("?")[0].split("/").pop()} -> ${publicUrl.split("/").pop()}`);
  }
}

let ok = 0;
let fail = 0;
for (const { table, url, id } of rows) {
  try {
    await patchRow(table, id, byUrl.get(url));
    ok++;
  } catch (err) {
    fail++;
    console.error(`  ERROR ${table}/${id}: ${err.message}`);
  }
}

console.log(`\nHecho: ${ok} actualizadas, ${fail} con error.`);
if (fail > 0) process.exit(1);
