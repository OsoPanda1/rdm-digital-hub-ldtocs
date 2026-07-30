"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Explorar", href: "/explorar" },
  { label: "Historia", href: "/historia" },
  { label: "Cultura", href: "/cultura" },
  { label: "Gastronomía", href: "/gastronomia" },
  { label: "Directorio", href: "/directorio" },
  { label: "Eventos", href: "/eventos" },
  { label: "Economía", href: "/economia" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Isabella", href: "/isabella" },
  { label: "Gobernanza", href: "/gobernanza" },
  { label: "Acerca", href: "/acerca" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2d35] bg-[#0a0b0e]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-serif text-lg font-bold text-[#c8a356] shrink-0">
            RDM
          </Link>

          <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors",
                  pathname === link.href
                    ? "bg-[#c8a356]/10 text-[#c8a356]"
                    : "text-[#9ca3af] hover:text-[#e8e6e0]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm text-[#c8a356] hover:underline"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth"
                className="text-sm text-[#c8a356] hover:underline"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
