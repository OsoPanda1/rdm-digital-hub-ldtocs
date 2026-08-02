'use client';
import React, { useState } from 'react';
import { READINESS_AREAS } from '../data/realDelMonteData';
import { ShieldCheck, CheckCircle2, Copy, Check, Users, ShieldAlert, Award, FileText } from 'lucide-react';

export const ReadinessGovernanceView: React.FC = () => {
  const [copiedText, setCopiedText] = useState(false);

  const canonicalText = `RDM Digital es la infraestructura digital soberana de Real del Monte, Hidalgo, diseñada como Nodo Cero de un ecosistema territorial inteligente que integra información, turismo y comercio local bajo una arquitectura federada, event-driven y self-hosted. Su operación se soporta en el TAMV Civilizational Core, el TAMV OS Kernel, ISABELLA AI y Cattleya Pay, garantizando soberanía de datos, trazabilidad, resiliencia operativa y reactivación económica comunitaria en una sola plataforma escalable.`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(canonicalText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const operationalRoles = [
    {
      role: 'Product Owner Cívico',
      owner: 'Gobernanza Territorial RDM',
      focus: 'Priorización del valor comunitario, denominación de origen del Paste e inclusión de artesanos.'
    },
    {
      role: 'Tech Lead / Principal Architect',
      owner: 'Núcleo TAMV OS',
      focus: 'Mantenimiento del Event Store, contratos TypeScript, integración de las 7 capas y API Gateway.'
    },
    {
      role: 'Data / AI Lead',
      owner: 'Equipo ISABELLA AI',
      focus: 'Entrenamiento de modelos territoriales, prompts del patrimonio histórico e hiper-localización.'
    },
    {
      role: 'SRE / DevOps Lead',
      owner: 'Infraestructura Edge Proxmox',
      focus: 'Resiliencia de servidores, respaldos BCP/DR, túneles DNS soberanos y monitoreo de latencia.'
    },
    {
      role: 'Security & Compliance Lead',
      owner: 'Comité de Auditoría Soberana',
      focus: 'Cifrado mTLS, validación de certificados Cattleya Pay y cumplimiento del marco legal.'
    }
  ];

  const roadmapSteps = [
    { title: 'Consolidar Pilares Web', desc: 'RDM Información, RDM Turismo y RDM Comercio en producción continua.', status: 'COMPLETADO' },
    { title: 'Fortalecer Kernel Territorial', desc: 'Sincronización event-driven y replay de eventos por hash.', status: 'COMPLETADO' },
    { title: 'Observabilidad & Trazabilidad', desc: 'Monitoreo de latencia, auditoría de decisiones y logs de IA.', status: 'EN_PROGRESO' },
    { title: 'Endurecimiento de Pagos & Reputación', desc: 'Seguridad en Cattleya Pay y validación comunitaria.', status: 'EN_PROGRESO' },
    { title: 'Formalizar Gobernanza & BCP/DR', desc: 'Planes de contingencia ante fallas de red y cumplimiento cívico.', status: 'PROGRAMADO' },
    { title: 'Expansión Federada TAMV', desc: 'Integración de nuevos nodos territoriales a la red soberana.', status: 'PROGRAMADO' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 border border-amber-500/40 shadow-2xl overflow-hidden text-slate-100">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Gobernanza & Estado de Readiness (73%)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Matriz de Madurez Técnica, Ownership & Roadmap Estratégico
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Evaluación continua del sistema soberano RDM Digital para garantizar operabilidad en piloto avanzado, auditoría de datos y escalabilidad hacia la red federada TAMV.
          </p>
        </div>
      </div>

      {/* Readiness Global Metric Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Índice Global de Readiness</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-950 font-mono">73%</span>
              <span className="text-xs text-amber-900 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Piloto Avanzado</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              El núcleo frontend, el Event Store y la IA ISABELLA muestran un estado maduro. Las prioridades de evolución centran el esfuerzo en hardening de seguridad y observabilidad profunda.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-700 font-bold">
              <span>Avance hacia 90%+</span>
              <span>73 / 100</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-600 rounded-full w-[73%]" />
            </div>
          </div>
        </div>

        {/* Readiness Area Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-950 font-serif">Desglose de Áreas Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {READINESS_AREAS.map((area) => (
              <div key={area.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">{area.name}</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    area.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {area.percentage}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      area.status === 'OPTIMAL' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Roles & Ownership Matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950 font-serif">
              Matriz de Gobierno Técnico & Roles Operativos
            </h3>
            <p className="text-xs text-slate-600">
              Asignación clara de responsabilidades para sostener la autonomía y soberanía del Nodo Cero
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {operationalRoles.map((r) => (
            <div key={r.role} className="bg-pearl-card rounded-3xl border border-slate-200 p-5 space-y-2 shadow-md">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">{r.role}</span>
              <h4 className="text-sm font-bold text-slate-950 font-serif">{r.owner}</h4>
              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">{r.focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Roadmap */}
      <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950 font-serif">
              Roadmap Unificado de Evolución (Hacia 90%+ Readiness)
            </h3>
            <p className="text-xs text-slate-600">
              Ruta priorizada para pasar de piloto avanzado a producción robusta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmapSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-mono font-bold">Fase 0{idx + 1}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  step.status === 'COMPLETADO' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                }`}>
                  {step.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-950 font-serif text-sm">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Canonical Institutional Block Box */}
      <div className="p-6 rounded-3xl bg-pearl-card border border-slate-200 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            Texto Maestro Canónico para Documentación
          </div>
          <button
            onClick={handleCopyText}
            className="px-4 py-2 rounded-xl bg-slate-950 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-slate-900"
          >
            {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedText ? '¡Copiado!' : 'Copiar Texto'}
          </button>
        </div>

        <p className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans italic">
          "{canonicalText}"
        </p>
      </div>
    </div>
  );
};

