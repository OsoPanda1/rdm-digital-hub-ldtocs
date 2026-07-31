import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "RDM Digital Hub — Real del Monte, Pueblo Mágico",
  description:
    "Plataforma territorial inteligente de Real del Monte, Hidalgo. Mapa interactivo, historia minera, gastronomía, eventos y directorio de negocios.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "RDM Digital Hub",
    title: "RDM Digital Hub — Real del Monte, Pueblo Mágico",
    description:
      "Plataforma territorial inteligente de Real del Monte. Mapa, historia, gastronomía, eventos y directorio de negocios.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
