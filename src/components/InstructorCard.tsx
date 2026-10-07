import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart, ChevronDown, ChevronUp, BookOpen, Check, Award, Copy } from 'lucide-react';
import { EvidenciaConfig } from '../types';

interface InstructorCardProps {
  instructorName: string;
  evidencia: EvidenciaConfig;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructorName, evidencia }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTip, setActiveTip] = useState<number>(0);
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const tipsPedagogicos = [
    {
      titulo: 'Retroalimentación con Nombre Propio',
      texto: 'Saludar al aprendiz por su nombre completo fortalece el vínculo afectivo y la motivación en ambientes virtuales de aprendizaje (AVA).',
    },
    {
      titulo: 'Reconocer Siempre el Esfuerzo',
      texto: 'Incluso en valoraciones D (No Aprobado), valorar el intento y el tiempo invertido reduce la deserción y propicia el reenvío.',
    },
    {
      titulo: 'Orientación al Plan de Mejora',
      texto: 'Indique con exactitud qué sección de la Guía de Aprendizaje debe consultar el aprendiz para alcanzar la calificación Aprobatoria.',
    },
  ];

  const frasesRapidas = [
    'Agradezco su dedicación y puntualidad en el envío.',
    'Excelente apropiación conceptual de la temática.',
    'Le invito a revisar las observaciones y reenviar su evidencia.',
    '¡Felicitaciones por su gran compromiso con la formación!',
  ];

  const handleCopyPhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  return (
    <div className="bg-gradient-to-b from-white via-emerald-50/20 to-teal-50/30 rounded-2xl border-2 border-emerald-200/80 shadow-sm overflow-hidden mb-4 relative">
      {/* Top subtle decorative strip */}
      <div className="h-2 bg-gradient-to-r from-emerald-400 via-[#39A900] to-teal-400"></div>

      <div className="p-4">
        <div className="flex items-center gap-3.5">
          {/* Avatar Image with subtle glowing border & SENA pin */}
          <div className="relative shrink-0">
            <div className="w-18 h-22 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-300 bg-emerald-50 relative group">
              <img
                src="/instructor-avatar.jpg"
                alt="Instructora Virtual SENA"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/src/assets/images/instructor_avatar_1791304253515.jpg';
                }}
              />
            </div>
            {/* SENA mini badge on avatar */}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-xs border border-emerald-300">
              <img src="/logo-sena.svg" alt="SENA" className="w-4 h-4" />
            </div>
          </div>

          {/* Instructor Bio & Greeting */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Instructora Virtual SENA
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-800 truncate leading-snug">
              {instructorName || 'Instructora SENA'}
            </h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Gestión Administrativa</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold">Cátedra Pensamiento Empresarial</span>
            </p>
          </div>

          {/* Collapse/Expand button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
            title={isExpanded ? 'Contraer panel' : 'Expandir panel'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Motivational speech bubble & AVA advice */}
        {isExpanded && (
          <div className="mt-3.5 pt-3 border-t border-emerald-100 space-y-2.5">
            {/* Pedagogical tip bubble */}
            <div className="bg-white/95 backdrop-blur-xs border border-emerald-100 rounded-xl p-3 shadow-2xs relative">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">
                    "{tipsPedagogicos[activeTip].titulo}":{' '}
                  </span>
                  <span>{tipsPedagogicos[activeTip].texto}</span>
                </div>
              </div>

              {/* Tip pager dots */}
              <div className="flex items-center justify-end gap-1.5 mt-2">
                {tipsPedagogicos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTip(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeTip === idx ? 'bg-emerald-600 w-5' : 'bg-slate-200 hover:bg-slate-300 w-1.5'
                    }`}
                    title={`Ver consejo ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Phrases Pills (Pastel Tones) */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Frases de Retroalimentación Rápida:</span>
                <span className="text-[9px] text-emerald-600 font-medium">Clic para copiar</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {frasesRapidas.map((frase, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCopyPhrase(frase)}
                    className="text-[10px] font-medium px-2 py-1 rounded-lg border bg-white/90 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border-slate-200 hover:border-emerald-300 text-left transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>{frase}</span>
                    {copiedPhrase === frase ? (
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Evidence reminder badge */}
            <div className="bg-emerald-100/70 border border-emerald-300/80 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-950 font-medium truncate">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-bold">{evidencia.codigo}:</span>
                <span className="truncate">{evidencia.titulo}</span>
              </div>
              <span className="text-[10px] bg-white text-emerald-900 font-extrabold px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs shrink-0">
                {evidencia.criterios.length} criterios
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
