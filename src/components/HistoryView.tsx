import React, { useState } from 'react';
import { CalificacionGuardada } from '../types';
import { BookOpen, Copy, Check, Trash2, Search, Calendar, FileText, Download } from 'lucide-react';

interface HistoryViewProps {
  evaluations: CalificacionGuardada[];
  setEvaluations: React.Dispatch<React.SetStateAction<CalificacionGuardada[]>>;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ evaluations, setEvaluations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopyFeedback = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: string) => {
    setEvaluations((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('¿Desea borrar todo el historial de retroalimentaciones guardadas?')) {
      setEvaluations([]);
    }
  };

  const filtered = evaluations.filter(
    (e) =>
      e.aprendizNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.evidenciaId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Historial de Retroalimentaciones Guardadas
          </h3>
          <p className="text-xs text-slate-500">
            Consulte y vuelva a copiar los comentarios de aprendices evaluados con anterioridad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por aprendiz o evidencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg w-56 bg-slate-50 focus:bg-white"
            />
          </div>

          {evaluations.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1 font-semibold"
              title="Borrar todo el historial"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {evaluations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
            <img src="/logo-sena.svg" alt="SENA" className="w-64 h-64 object-contain" />
          </div>
          <div className="relative z-10">
            <BookOpen className="w-10 h-10 text-emerald-600/60 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800">Aún no hay evaluaciones guardadas</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Cuando califique a un aprendiz en el módulo principal, presione el botón <strong>"Guardar Evaluación"</strong> para archivar el registro y consultarlo en cualquier momento.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const isApproved = item.estado === 'A';

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black font-mono shrink-0 border shadow-2xs ${
                        isApproved
                          ? 'bg-emerald-100/90 text-emerald-950 border-emerald-300'
                          : 'bg-rose-100/90 text-rose-950 border-rose-300'
                      }`}
                    >
                      {item.estado} &bull; {item.puntajeTotal} pts
                    </span>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.aprendizNombre}
                      </h4>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          {item.evidenciaId}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" /> {item.fecha}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopyFeedback(item.id, item.retroalimentacionTexto)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        copiedId === item.id
                          ? 'bg-emerald-200 text-emerald-950 border-emerald-400 shadow-xs'
                          : 'bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 border-emerald-300 shadow-2xs'
                      }`}
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-emerald-800" />}
                      <span>{copiedId === item.id ? '¡Copiado!' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="px-2.5 py-1.5 bg-sky-100/80 hover:bg-sky-200 text-sky-950 border border-sky-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                    >
                      {isExpanded ? 'Ocultar' : 'Ver Comentario'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar este registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto shadow-inner">
                      {item.retroalimentacionTexto}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
