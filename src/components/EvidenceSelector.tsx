import React from 'react';
import { EVIDENCIAS } from '../data/courseData';
import { EvidenciaConfig, EvidenciaId } from '../types';
import { FileText, MessageSquare, Briefcase, Video, CheckCircle2, Info } from 'lucide-react';

interface EvidenceSelectorProps {
  selectedEvidenceId: EvidenciaId;
  onSelectEvidence: (evidencia: EvidenciaConfig) => void;
}

export const EvidenceSelector: React.FC<EvidenceSelectorProps> = ({
  selectedEvidenceId,
  onSelectEvidence,
}) => {
  const getIcon = (id: EvidenciaId) => {
    switch (id) {
      case 'AA1-EV02':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'AA2-EV01':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'AA2-EV02':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'AA2-EV03':
        return <Video className="w-4 h-4 text-purple-600" />;
    }
  };

  const getBadgeColor = (tipo: string) => {
    if (tipo.includes('producto')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (tipo.includes('conocimiento')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const current = EVIDENCIAS.find((e) => e.id === selectedEvidenceId) || EVIDENCIAS[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#39A900]"></div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Evidencias Calificables del Programa (4)
          </h2>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
          Módulo I: Mentalidad Empresarial
        </span>
      </div>

      {/* Grid of 4 evidences in pastel color palettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {EVIDENCIAS.map((ev) => {
          const isSelected = ev.id === selectedEvidenceId;
          const isProducto = ev.tipo.includes('producto');
          const isConocimiento = ev.tipo.includes('conocimiento');

          let pastelBg = isProducto
            ? 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/70'
            : isConocimiento
            ? 'bg-sky-50/70 border-sky-200/80 hover:bg-sky-100/70'
            : 'bg-purple-50/70 border-purple-200/80 hover:bg-purple-100/70';

          let selectedRing = isSelected
            ? isProducto
              ? 'ring-2 ring-emerald-400 border-emerald-500 bg-emerald-100/80 shadow-xs'
              : isConocimiento
              ? 'ring-2 ring-sky-400 border-sky-500 bg-sky-100/80 shadow-xs'
              : 'ring-2 ring-purple-400 border-purple-500 bg-purple-100/80 shadow-xs'
            : '';

          return (
            <button
              key={ev.id}
              onClick={() => onSelectEvidence(ev)}
              className={`p-3 rounded-xl text-left transition-all relative border flex flex-col justify-between ${pastelBg} ${selectedRing}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${getBadgeColor(
                      ev.tipo
                    )}`}
                  >
                    {ev.codigo}
                  </span>
                  <div className="flex items-center gap-1">
                    {getIcon(ev.id)}
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 font-bold" />
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {ev.titulo}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-[10px] font-semibold text-slate-700 truncate max-w-[120px]">
                  {ev.tipo.replace('Evidencia de ', '')}
                </span>
                <span className="font-mono text-[10px] bg-white/90 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 shadow-2xs font-semibold">
                  {ev.criterios.length} criterios
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed banner of the selected evidence with subtle watermark */}
      <div className="mt-3.5 bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        {/* Subtle SENA Watermark */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05] select-none">
          <img src="/logo-sena.svg" alt="SENA Marca de Agua" className="w-40 h-40 object-contain" />
        </div>

        <div className="flex items-start gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/90 border border-emerald-300 flex items-center justify-center shrink-0">
            {getIcon(current.id)}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 flex flex-wrap items-center gap-2">
              <span className="text-sm">{current.codigo}: {current.titulo}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Calificable AVA
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                {current.tipo}
              </span>
            </div>
            <div className="text-slate-700 text-[11px] mt-1">
              <strong className="text-slate-900">Resultado de Aprendizaje (RAP):</strong> {current.rap}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {current.descripcion}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 relative z-10 self-end md:self-center">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-700 shadow-2xs font-semibold">
            <span>Duración:</span>
            <strong className="text-emerald-700">{current.duracionEstimada}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
