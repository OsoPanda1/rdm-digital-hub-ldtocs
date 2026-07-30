import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#2a2d35] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-[#c8a356] font-bold mb-3">RDM Hub</h3>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li><Link href="/acerca" className="hover:text-[#e8e6e0]">Acerca</Link></li>
              <li><Link href="/acerca?section=filosofia" className="hover:text-[#e8e6e0]">Filosofía</Link></li>
              <li><Link href="/acerca?section=contacto" className="hover:text-[#e8e6e0]">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-3">Territorio</h3>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li><Link href="/explorar" className="hover:text-[#e8e6e0]">Explorar</Link></li>
              <li><Link href="/directorio" className="hover:text-[#e8e6e0]">Directorio</Link></li>
              <li><Link href="/eventos" className="hover:text-[#e8e6e0]">Eventos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-3">Comunidad</h3>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li><Link href="/comunidad" className="hover:text-[#e8e6e0]">Feed</Link></li>
              <li><Link href="/comunidad?section=wiki" className="hover:text-[#e8e6e0]">Wiki</Link></li>
              <li><Link href="/gobernanza" className="hover:text-[#e8e6e0]">Gobernanza</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-[#9ca3af]">
              <li><Link href="/gobernanza?section=politicas" className="hover:text-[#e8e6e0]">Privacidad</Link></li>
              <li><Link href="/gobernanza?section=politicas" className="hover:text-[#e8e6e0]">Términos</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#2a2d35] text-center text-sm text-[#6b7280]">
          <p>RDM Digital Hub — Nodo Cero</p>
          <p className="mt-1">Real del Monte, Hidalgo, México</p>
        </div>
      </div>
    </footer>
  );
}
