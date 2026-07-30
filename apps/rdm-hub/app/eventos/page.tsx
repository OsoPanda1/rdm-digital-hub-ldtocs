"use client";

const events = [
  { date: "15 Mar", title: "Feria del Paste", loc: "Plaza de la Constitución", type: "Gastronomía" },
  { date: "20 Mar", title: "Concierto de Música de Viento", loc: "Teatro Hidalgo", type: "Cultural" },
  { date: "05 Abr", title: "Recorrido Nocturno Leyendas", loc: "Centro Histórico", type: "Turismo" },
  { date: "12 Abr", title: "Exposición de Artesanía", loc: "Casa de Cultura", type: "Cultural" },
  { date: "01 May", title: "Feria de la Primavera", loc: "Jardín Principal", type: "Festividad" },
  { date: "15 May", title: "Día del Minero", loc: "Mina de Acosta", type: "Tradición" },
];

export default function EventosPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-bold">Eventos</h1>
        <p className="text-[#9ca3af]">Calendario cultural, turístico y social de Real del Monte.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.title} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#c8a356] font-bold">{ev.date}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#1e2128] text-[#9ca3af]">{ev.type}</span>
              </div>
              <h3 className="font-medium">{ev.title}</h3>
              <p className="text-sm text-[#9ca3af] mt-1">{ev.loc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
