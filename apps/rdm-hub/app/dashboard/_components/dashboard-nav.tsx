"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Inicio", href: "/dashboard", icon: "◇" },
  { label: "Territorio", href: "/dashboard/territorio", icon: "◇" },
  { label: "Isabella AI", href: "/isabella", icon: "◇" },
  { label: "Economía", href: "/dashboard/economia", icon: "◇" },
  { label: "Comunidad", href: "/dashboard/comunidad", icon: "◇" },
  { label: "Observabilidad", href: "/dashboard/observabilidad", icon: "◇" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-[#2a2d35] bg-[#121418] flex flex-col">
      <div className="p-6 border-b border-[#2a2d35]">
        <Link href="/" className="font-serif text-xl font-bold text-[#c8a356]">
          RDM Hub
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-[#c8a356]/10 text-[#c8a356]"
                : "text-[#9ca3af] hover:text-[#e8e6e0] hover:bg-[#1a1d24]",
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2a2d35]">
        <button
          onClick={signOut}
          className="w-full text-left px-3 py-2 text-sm text-[#9ca3af] hover:text-red-400 rounded-lg hover:bg-[#1a1d24] transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
