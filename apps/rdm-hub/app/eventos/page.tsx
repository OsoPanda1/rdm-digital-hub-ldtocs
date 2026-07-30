"use client";

import { useEventos } from "@/hooks/use-eventos";

export default function EventosPage() {
  const { data: eventos, isLoading } = useEventos();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-bold">Eventos</h1>
        <p className="text-[#9ca3af]">Calendario cultural, turístico y social de Real del Monte.</p>

        {isLoading ? (
          <div className="text-[#6b7280]">Cargando eventos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventos?.map((ev) => (
              <div key={ev.id} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#c8a356] font-bold">{ev.date}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#1e2128] text-[#9ca3af]">{ev.category}</span>
                </div>
                <h3 className="font-medium">{ev.title}</h3>
                <p className="text-sm text-[#9ca3af] mt-1">{ev.location}</p>
                <p className="text-xs text-[#6b7280] mt-2 line-clamp-2">{ev.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
