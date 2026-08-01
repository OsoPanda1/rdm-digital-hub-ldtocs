/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: https://i.ytimg.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.vercel.app https://vitals.vercel-insights.com https://www.youtube.com https://www.youtube-nocookie.com",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
              "media-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "frame-ancestors 'self' https://*.lovable.app https://*.lovableproject.com https://*.lovable.dev",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
