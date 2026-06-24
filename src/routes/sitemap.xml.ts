// Stub sitemap generator. Reemplazar `BASE_URL` por el dominio definitivo
// y poblar `entries` desde el router de la app o la BD (rutas dinámicas).

import type { APIContext } from "./_types";

const BASE_URL = "https://realdelmonte.example";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export async function GET(_ctx: APIContext): Promise<Response> {
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/cultura", changefreq: "weekly", priority: "0.8" },
    { path: "/economia", changefreq: "weekly", priority: "0.8" },
    { path: "/gemelo", changefreq: "monthly", priority: "0.6" },
    { path: "/contacto", changefreq: "monthly", priority: "0.5" },
  ];

  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}
