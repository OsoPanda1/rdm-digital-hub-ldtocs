'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, HelpCircle, Shield, Mountain } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'isabella';
  text: string;
  timestamp: string;
}

export const IsabellaAiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'isabella',
      text: '¡Saludos! Soy ISABELLA, la Inteligencia Civilizacional e Histórica de Real del Monte, Nodo Cero de la red TAMV. Estoy para asesorarte en historia minera, rutas autoguiadas, gastronomía del Paste auténtico, normativas territoriales y la pasarela ética Cattleya Pay. ¿En qué puedo asistirte hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Cuéntame la historia del Paste y por qué lleva chile serrano',
    '¿Qué ruta turística me recomiendas si hay neblina intensa?',
    'Explicación del Panteón Inglés y la tumba de Richard Bell',
    '¿Cómo funciona la retribución del 3% al Fondo Patrimonial de Cattleya Pay?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/isabella', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, conversationHistory: messages })
      });

      const data = await res.json();

      const isabellaMsg: ChatMessage = {
        id: `isa_${Date.now()}`,
        sender: 'isabella',
        text: data.response || data.error || 'ISABELLA AI no devolvió respuesta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, isabellaMsg]);
    } catch (err: any) {
      console.error('Error contacting ISABELLA AI:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `isa_err_${Date.now()}`,
          sender: 'isabella',
          text: 'Disculpa la interrupción. Ocurrió una breve falla de comunicación con el servicio de ISABELLA AI. Real del Monte mantiene su información soberana respaldada.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-900 p-6 sm:p-8 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            ISABELLA AI — Capa 4 del Kernel TAMV OS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Asistente & Inteligencia Civilizacional de Real del Monte
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Consulte en tiempo real sobre la historia de los mineros de Cornwall, las rutas georreferenciadas, la receta original del Paste Hidalguense, el Panteón Inglés o la economía trazable de Cattleya Pay.
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          Consultas Frecuentes Sugeridas
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-900/60 hover:border-purple-500/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left font-medium"
            >
              ✨ {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col h-[520px] justify-between space-y-4">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-purple-600 text-white ring-2 ring-purple-400/40'
              }`}>
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 font-sans'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span>{msg.sender === 'user' ? 'Tú (Visitante RDM)' : 'ISABELLA AI — Nodo Cero'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-purple-300 font-medium p-4 rounded-2xl bg-slate-950/80 border border-purple-900/40 w-fit animate-pulse">
              <Bot className="w-5 h-5 text-purple-400 animate-spin" />
              <span>ISABELLA AI procesando consulta territorial con Gemini 3.6 Flash...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-3 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu consulta a ISABELLA AI sobre Real del Monte..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Consultar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
