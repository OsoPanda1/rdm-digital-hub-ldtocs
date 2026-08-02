'use client';
import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Compass, MapPin, Utensils, ShieldAlert, Bot } from 'lucide-react';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'isabella'; text: string; time: string }>>([
    {
      sender: 'isabella',
      text: '¡Hola! Soy ISABELLA AI, tu guía nativa e inteligencia civilizacional de Real del Monte. ¿Qué te gustaría explorar hoy? Puedo recomendarte recorridos, contarte la leyenda del Panteón Inglés o buscar el mejor paste caliente.',
      time: 'Ahora'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    '🌲 ¿Qué hacer en un día de neblina?',
    '🥧 Dónde comer los mejores pastes tradicionales',
    '👻 Historia y leyendas del Panteón Inglés',
    '🅿️ Estacionamientos con cupo disponible'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = { sender: 'user' as const, text, time: 'Ahora' };
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Dynamic response simulation
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      if (lower.includes('neblina') || lower.includes('clima')) {
        reply = '🌧️ **Recomendación para Clima de Neblina (11°C):**\nVisita la Mina de Acosta con casco térmico, luego refugiarte en Pastequería El Portal para un paste de carne con papa recién horneado y café de olla. Termina en el Museo del Paste.';
      } else if (lower.includes('paste') || lower.includes('comer')) {
        reply = '🥧 **Guía Gastronómica de Pastes:**\n1. *El Portal:* Paste de carne con papa en hojaldre tradicional.\n2. *Mina Acosta:* Pastes de frijol con chorizo en bolsa al vacío para llevar.\n3. *Las Carmelitas:* Especialidad en pastes dulces de manzana y piña.';
      } else if (lower.includes('leyenda') || lower.includes('panteon') || lower.includes('fantasma')) {
        reply = '👻 **Leyenda del Panteón Inglés:**\nSe dice que la tumba de Richard Bell apunta en dirección opuesta a Inglaterra por despecho... Escucha el Podcast Capítulo 3 en el módulo de Medios para ver la recreación en audio 3D.';
      } else if (lower.includes('estacionamiento') || lower.includes('parking') || lower.includes('autos')) {
        reply = '🅿️ **Estacionamientos Disponibles:**\n- *Parking Central Mina Acosta:* 24 lugares libres (Tarifa: $20 MXN/hr).\n- *Estacionamiento Parroquia:* 12 lugares libres.\n- *Plaza Principal:* Lleno (Tráfico moderado en calle principal).';
      } else {
        reply = `✨ Recomiendo iniciar tu recorrido en la **Plaza Principal**, tomar el turibús histórico por los tiros mineros y probar la comida típica en las fondas locales. ¿Deseas que trace una ruta autoguiada en tu mapa?`;
      }

      setMessages(prev => [...prev, { sender: 'isabella', text: reply, time: 'Ahora' }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-2xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-300 animate-bounce"
        >
          <Sparkles className="w-6 h-6 animate-spin duration-3000" />
          <span className="hidden sm:inline text-xs font-black uppercase tracking-wider pr-1">
            ISABELLA AI Guía Real del Monte
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
        </button>
      )}

      {/* Floating Popup Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[520px] bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-4 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-amber-400 text-slate-950 shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white font-serif flex items-center gap-1.5">
                  ISABELLA AI
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    2.5 Flash
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Inteligencia Civilizacional Online
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-slate-950 p-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 text-[10px] whitespace-nowrap cursor-pointer transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta a ISABELLA sobre Real del Monte..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
