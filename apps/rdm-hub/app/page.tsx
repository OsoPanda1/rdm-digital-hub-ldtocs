import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#2a2d35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-[#c8a356]">
            RDM Hub
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#9ca3af]">
            <Link href="/explorar" className="hover:text-[#e8e6e0] transition-colors">Explorar</Link>
            <Link href="/auth" className="hover:text-[#e8e6e0] transition-colors">Ingresar</Link>
            <Link
              href="/auth?tab=register"
              className="bg-[#c8a356] text-[#0a0b0e] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d4b26a] transition-colors"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Real del Monte
            <span className="block text-[#c8a356] mt-2">Digital Hub</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#9ca3af] max-w-2xl mx-auto leading-relaxed">
            Plataforma territorial inteligente del Pueblo Mágico.
            Mapa, historia, gastronomía, economía y memoria colectiva.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/explorar"
              className="bg-[#c8a356] text-[#0a0b0e] px-8 py-3 rounded-lg font-medium hover:bg-[#d4b26a] transition-colors"
            >
              Explorar el territorio
            </Link>
            <Link
              href="/auth"
              className="border border-[#2a2d35] text-[#e8e6e0] px-8 py-3 rounded-lg font-medium hover:bg-[#1a1d24] transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="mt-16 w-full max-w-3xl mx-auto px-4 aspect-video rounded-xl overflow-hidden border border-[#2a2d35]">
          <iframe
            src="https://www.youtube-nocookie.com/embed/gl_3mLH24ng"
            title="Real del Monte - Video Promocional"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto w-full px-4">
          {[
            { label: "Lugares", href: "/explorar" },
            { label: "Historia", href: "/historia" },
            { label: "Gastronomía", href: "/gastronomia" },
            { label: "Eventos", href: "/eventos" },
            { label: "Mapa", href: "/explorar" },
            { label: "Cultura", href: "/cultura" },
            { label: "Directorio", href: "/directorio" },
            { label: "Isabella AI", href: "/isabella" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-[#2a2d35] rounded-xl p-4 sm:p-6 text-center hover:border-[#c8a356] hover:bg-[#121418] transition-all group"
            >
              <span className="text-sm text-[#9ca3af] group-hover:text-[#c8a356] transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#2a2d35] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#6b7280]">
          <p>RDM Digital Hub — Nodo Cero</p>
          <p className="mt-1">Real del Monte, Hidalgo, México</p>
        </div>
      </footer>
    </div>
  );
}
