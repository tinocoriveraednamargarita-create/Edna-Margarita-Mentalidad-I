import React, { useState } from 'react';
import { INFORMACION_CURSO } from '../data/courseData';
import { Award, BookOpen, Clock, Download, ExternalLink, UserCheck, Sparkles, Sliders } from 'lucide-react';

interface HeaderProps {
  instructorName: string;
  setInstructorName: (name: string) => void;
  activeTab: 'evaluator' | 'learners' | 'extension' | 'history';
  setActiveTab: (tab: 'evaluator' | 'learners' | 'extension' | 'history') => void;
  totalEvaluated: number;
  totalLearners: number;
}

export const Header: React.FC<HeaderProps> = ({
  instructorName,
  setInstructorName,
  activeTab,
  setActiveTab,
  totalEvaluated,
  totalLearners,
}) => {
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top green strip */}
      <div className="bg-[#39A900] text-white px-4 py-2 flex flex-wrap items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#39A900] font-extrabold px-2 py-0.5 rounded text-[11px] tracking-wider uppercase shadow-xs">
            SENA AVA
          </div>
          <span className="hidden sm:inline font-semibold">
            {INFORMACION_CURSO.entidad} &bull; {INFORMACION_CURSO.area}
          </span>
          <span className="inline sm:hidden font-semibold">SENA &bull; Gestión Administrativa</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] opacity-95">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {INFORMACION_CURSO.duracion}
          </span>
          <span className="hidden md:inline font-mono bg-white/20 px-2 py-0.5 rounded text-white font-semibold">
            Escala: A (70-100) / D (0-69)
          </span>
        </div>
      </div>

      {/* Main banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Prominent SENA Logo Badge */}
          <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 shadow-xs flex items-center justify-center p-1.5 shrink-0 hover:scale-105 transition-transform">
            <img src="/logo-sena.svg" alt="Logo SENA" className="w-full h-full object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {INFORMACION_CURSO.nombre}
              </h1>
              <span className="hidden lg:inline-flex text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Gestión Administrativa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
              <span>Herramienta Oficial de Evaluación & Retroalimentación Pedagógica AVA</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">4 Evidencias Institucionales con Rúbrica y Nombre Propio</span>
            </p>
          </div>
        </div>

        {/* Instructor profile & stats */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="bg-white border border-emerald-100 shadow-2xs rounded-xl p-2 flex items-center gap-2.5">
            {/* Instructor Avatar Thumbnail */}
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-200 shadow-2xs shrink-0 relative bg-emerald-50">
              <img
                src="/instructor-avatar.jpg"
                alt="Instructora SENA"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/src/assets/images/instructor_avatar_1791304253515.jpg';
                }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white"></div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instructor(a) Virtual</div>
              {isEditingInstructor ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="text-xs font-semibold px-2 py-0.5 border border-emerald-400 rounded bg-white text-slate-800 w-40"
                    autoFocus
                    onBlur={() => setIsEditingInstructor(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingInstructor(false)}
                  />
                  <button
                    onClick={() => setIsEditingInstructor(false)}
                    className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingInstructor(true)}
                  className="text-xs font-bold text-slate-800 cursor-pointer hover:text-emerald-700 flex items-center gap-1 group"
                  title="Clic para cambiar nombre del instructor"
                >
                  <span className="truncate max-w-[150px]">{instructorName}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600">✎</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2 px-3 text-center min-w-[85px] shadow-2xs">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Evaluados</div>
            <div className="text-sm font-extrabold text-emerald-950 leading-tight">
              {totalEvaluated} <span className="text-xs font-normal text-emerald-700">/ {totalLearners}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation in pastel colors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-100 overflow-x-auto py-1">
        <button
          onClick={() => setActiveTab('evaluator')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all border ${
            activeTab === 'evaluator'
              ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300 shadow-2xs font-bold'
              : 'bg-slate-50 text-slate-600 border-transparent hover:bg-emerald-50/50 hover:text-emerald-800 hover:border-emerald-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-700" />
          <span>Calificador & Rúbrica AVA</span>
        </button>

        <button
          onClick={() => setActiveTab('learners')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all border ${
            activeTab === 'learners'
              ? 'bg-sky-100/80 text-sky-900 border-sky-300 shadow-2xs font-bold'
              : 'bg-slate-50 text-slate-600 border-transparent hover:bg-sky-50/50 hover:text-sky-800 hover:border-sky-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-sky-700" />
          <span>Lista de Aprendices ({totalLearners})</span>
        </button>

        <button
          onClick={() => setActiveTab('extension')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all border ${
            activeTab === 'extension'
              ? 'bg-purple-100/80 text-purple-900 border-purple-300 shadow-2xs font-bold'
              : 'bg-slate-50 text-slate-600 border-transparent hover:bg-purple-50/50 hover:text-purple-800 hover:border-purple-200'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-purple-700" />
          <span>Extensión Google Chrome (ZIP & Guía)</span>
          <span className="bg-purple-200 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
            V3
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all border ${
            activeTab === 'history'
              ? 'bg-amber-100/80 text-amber-900 border-amber-300 shadow-2xs font-bold'
              : 'bg-slate-50 text-slate-600 border-transparent hover:bg-amber-50/50 hover:text-amber-800 hover:border-amber-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Historial de Calificaciones ({totalEvaluated})</span>
        </button>
      </div>
    </header>
  );
};
