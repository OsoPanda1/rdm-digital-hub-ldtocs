import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://visitarealdelmonte.online';
  const routes = [
    '', '/explorar', '/historia', '/cultura', '/gastronomia',
    '/economia', '/comunidad', '/isabella', '/gobernanza',
    '/directorio', '/eventos', '/acerca',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
