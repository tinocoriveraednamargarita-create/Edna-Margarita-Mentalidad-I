import React from 'react';
import { EvidenciaConfig, CriterioEvaluado, CalificacionEstado } from '../types';
import { Check, Star, AlertCircle, Sparkles, User, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface RubricEvaluatorProps {
  evidencia: EvidenciaConfig;
  learnerName: string;
  setLearnerName: (name: string) => void;
  criteriaRatings: Record<string, 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'>;
  setCriteriaRatings: React.Dispatch<
    React.SetStateAction<Record<string, 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'>>
  >;
  selectedStrengths: string[];
  setSelectedStrengths: React.Dispatch<React.SetStateAction<string[]>>;
  selectedImprovements: string[];
  setSelectedImprovements: React.Dispatch<React.SetStateAction<string[]>>;
  customNotes: string;
  setCustomNotes: (notes: string) => void;
  totalScore: number;
  status: CalificacionEstado;
  availableLearners: { id: string; nombreCompleto: string }[];
  onSelectLearnerFromList?: (name: string) => void;
}

export const RubricEvaluator: React.FC<RubricEvaluatorProps> = ({
  evidencia,
  learnerName,
  setLearnerName,
  criteriaRatings,
  setCriteriaRatings,
  selectedStrengths,
  setSelectedStrengths,
  selectedImprovements,
  setSelectedImprovements,
  customNotes,
  setCustomNotes,
  totalScore,
  status,
  availableLearners,
  onSelectLearnerFromList,
}) => {
  const isApproved = status === 'A';

  const handleLevelSelect = (
    criterioId: string,
    nivel: 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'
  ) => {
    setCriteriaRatings((prev) => ({
      ...prev,
      [criterioId]: nivel,
    }));
  };

  const handleSetAllLevels = (nivel: 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente') => {
    const updated: Record<string, 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'> = {};
    evidencia.criterios.forEach((c) => {
      updated[c.id] = nivel;
    });
    setCriteriaRatings(updated);
  };

  const toggleStrength = (strength: string) => {
    setSelectedStrengths((prev) =>
      prev.includes(strength) ? prev.filter((s) => s !== strength) : [...prev, strength]
    );
  };

  const toggleImprovement = (improvement: string) => {
    setSelectedImprovements((prev) =>
      prev.includes(improvement) ? prev.filter((i) => i !== improvement) : [...prev, improvement]
    );
  };

  return (
    <div className="space-y-4">
      {/* Learner name and rapid profile card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nombre Completo del Aprendiz a Retroalimentar:</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                placeholder="Ej: Laura Sofía Martínez Gómez"
                className="w-full text-sm font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent bg-slate-50/50 hover:bg-white"
              />
              {learnerName && (
                <button
                  type="button"
                  onClick={() => setLearnerName('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick learner suggestion dropdown if learners exist */}
          {availableLearners.length > 0 && (
            <div className="sm:w-64">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                O seleccionar de la ficha:
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setLearnerName(e.target.value);
                    if (onSelectLearnerFromList) onSelectLearnerFromList(e.target.value);
                  }
                }}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccionar aprendiz registrado...
                </option>
                {availableLearners.map((l) => (
                  <option key={l.id} value={l.nombreCompleto}>
                    {l.nombreCompleto}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Rúbrica de Evaluación Institucional */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Rúbrica Institucional AVA:</span>
              <span className="text-emerald-700 font-semibold">{evidencia.codigo}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Seleccione el nivel de logro alcanzado por el aprendiz en cada criterio.
            </p>
          </div>

          {/* Rapid preset buttons in pastel tones */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Rápido:</span>
            <button
              type="button"
              onClick={() => handleSetAllLevels('Excelente')}
              className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-100/90 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg transition-all shadow-2xs"
              title="Asignar Excelente (100) a todos"
            >
              ★ Todos Excelente
            </button>
            <button
              type="button"
              onClick={() => handleSetAllLevels('Bueno')}
              className="text-[11px] font-semibold px-2.5 py-1 bg-sky-100/90 hover:bg-sky-200 text-sky-900 border border-sky-300 rounded-lg transition-all shadow-2xs"
              title="Asignar Bueno (80) a todos"
            >
              ✓ Bueno (80)
            </button>
            <button
              type="button"
              onClick={() => handleSetAllLevels('Regular')}
              className="text-[11px] font-semibold px-2.5 py-1 bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg transition-all shadow-2xs"
              title="Asignar Regular (60) a todos"
            >
              ⚠ Regular (60)
            </button>
          </div>
        </div>

        {/* Criteria list */}
        <div className="space-y-4">
          {evidencia.criterios.map((criterio, index) => {
            const currentLevel = criteriaRatings[criterio.id] || 'Excelente';
            const selectedLevelObj =
              criterio.niveles.find((n) => n.nivel === currentLevel) || criterio.niveles[0];

            return (
              <div
                key={criterio.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">
                      {criterio.nombre}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 self-start sm:self-auto">
                    Peso: {criterio.peso}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mb-3 ml-7">{criterio.descripcion}</p>

                {/* Level selector buttons in pastel tones */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 ml-0 sm:ml-7">
                  {criterio.niveles.map((lvl) => {
                    const isSelected = currentLevel === lvl.nivel;
                    let activeStyles = 'border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50';

                    if (lvl.nivel === 'Excelente') {
                      activeStyles = isSelected
                        ? 'bg-emerald-200/90 text-emerald-950 border-emerald-500 shadow-xs ring-2 ring-emerald-300/70 font-bold'
                        : 'bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border-emerald-200/80';
                    } else if (lvl.nivel === 'Bueno') {
                      activeStyles = isSelected
                        ? 'bg-sky-200/90 text-sky-950 border-sky-500 shadow-xs ring-2 ring-sky-300/70 font-bold'
                        : 'bg-sky-50/70 hover:bg-sky-100/70 text-sky-900 border-sky-200/80';
                    } else if (lvl.nivel === 'Regular') {
                      activeStyles = isSelected
                        ? 'bg-amber-200/90 text-amber-950 border-amber-500 shadow-xs ring-2 ring-amber-300/70 font-bold'
                        : 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border-amber-200/80';
                    } else {
                      activeStyles = isSelected
                        ? 'bg-rose-200/90 text-rose-950 border-rose-500 shadow-xs ring-2 ring-rose-300/70 font-bold'
                        : 'bg-rose-50/70 hover:bg-rose-100/70 text-rose-900 border-rose-200/80';
                    }

                    return (
                      <button
                        key={lvl.nivel}
                        type="button"
                        onClick={() => handleLevelSelect(criterio.id, lvl.nivel)}
                        className={`px-2.5 py-2 rounded-lg border text-left flex flex-col justify-between text-xs transition-all ${activeStyles}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-semibold text-[11px]">{lvl.nivel}</span>
                          <span className="font-mono text-[10px] opacity-80 font-bold">{lvl.puntos} pts</span>
                        </div>
                        <span
                          className={`text-[9.5px] mt-1 line-clamp-2 leading-tight ${
                            isSelected ? 'font-medium opacity-95' : 'text-slate-500'
                          }`}
                        >
                          {lvl.descripcion}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback observation preview for this criterion */}
                <div className="mt-2.5 ml-0 sm:ml-7 text-[11px] bg-white border border-slate-200 rounded p-2 text-slate-700 flex items-start gap-1.5">
                  <span className="font-bold text-slate-500 shrink-0">Observación asignada:</span>
                  <span className="italic text-slate-600">{selectedLevelObj.observacionSugerida}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Score & Institutional Judgment Bar in Pastel Aesthetics */}
        <div className="mt-4 pt-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Juicio de Evaluación Institucional SENA (AVA)</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`text-base sm:text-lg font-black px-3 py-1 rounded-xl border flex items-center gap-1.5 shadow-2xs ${
                    isApproved
                      ? 'bg-emerald-100/90 text-emerald-950 border-emerald-300'
                      : 'bg-rose-100/90 text-rose-950 border-rose-300'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>A - APROBADO</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-700" />
                      <span>D - NO APROBADO / DEFICIENTE</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-medium text-slate-600 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200">
                  {isApproved ? 'Alcanza el Resultado de Aprendizaje (RAP)' : 'Requiere plan de mejoramiento y reenvío'}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Puntaje Cuantitativo Ponderado
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                {totalScore} <span className="text-xs font-semibold text-slate-400">/ 100 pts</span>
              </div>
            </div>
          </div>

          {/* Visual Pastel Progress Bar with 70 pt passing threshold */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span>0 pts</span>
              <span className="text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-bold">
                Mínimo Aprobatorio: 70 pts
              </span>
              <span>100 pts</span>
            </div>
            <div className="relative w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isApproved
                    ? 'bg-gradient-to-r from-emerald-300 to-[#39A900]'
                    : 'bg-gradient-to-r from-amber-300 to-rose-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, totalScore))}%` }}
              ></div>
              {/* Threshold line at 70% */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-600 z-10"
                style={{ left: '70%' }}
                title="Umbral de Aprobación (70 pts)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fortalezas y Oportunidades de Mejora AVA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fortalezas comunes */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aspectos Destacados / Fortalezas:</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {selectedStrengths.length} seleccionadas
            </span>
          </div>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {evidencia.fortalezasComunes.map((fortaleza, i) => {
              const isChecked = selectedStrengths.includes(fortaleza);
              return (
                <label
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded text-xs cursor-pointer border transition-colors ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleStrength(fortaleza)}
                    className="mt-0.5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="leading-tight text-[11px]">{fortaleza}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sugerencias de mejora según guía AVA */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Sugerencias de Mejora (Guía AVA):</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {selectedImprovements.length} seleccionadas
            </span>
          </div>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {evidencia.mejorasComunes.map((mejora, i) => {
              const isChecked = selectedImprovements.includes(mejora);
              return (
                <label
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded text-xs cursor-pointer border transition-colors ${
                    isChecked
                      ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleImprovement(mejora)}
                    className="mt-0.5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span className="leading-tight text-[11px]">{mejora}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Observaciones personalizadas adicionales */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Observaciones Particulares Adicionales del Instructor (Opcional):
        </label>
        <textarea
          rows={2}
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Escriba comentarios puntuales observados en el documento o video del aprendiz (ej. 'Excelente análisis del emprendimiento de repostería en Boyacá', o 'El enlace del video requería permisos')..."
          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900] bg-slate-50/40 hover:bg-white resize-y"
        />
      </div>
    </div>
  );
};
