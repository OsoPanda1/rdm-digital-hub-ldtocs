import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'RDM Web Games · Minijuegos Territoriales',
  description: 'Portal de minijuegos federados: Mina Responsable, Ruta del Guardián. Gamificación con Cattleya tiers.',
  openGraph: {
    title: 'RDM Web Games',
    description: 'Minijuegos territoriales con gamificación Cattleya',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} font-body antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}