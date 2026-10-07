import React, { useState } from 'react';
import { Award, BookOpen, Clock, Download, Sparkles, UserCheck, CheckCircle2, ChevronRight, Layers, MessageSquare, Briefcase, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { INFORMACION_CURSO, EVIDENCIAS } from '../data/courseData';

interface MainHeroBannerProps {
  instructorName: string;
  onNavigateTab: (tab: 'evaluator' | 'learners' | 'extension' | 'history') => void;
  totalEvaluated: number;
  totalLearners: number;
}

export const MainHeroBanner: React.FC<MainHeroBannerProps> = ({
  instructorName,
  onNavigateTab,
  totalEvaluated,
  totalLearners,
}) => {
  const [selectedPhotoVersion, setSelectedPhotoVersion] = useState<'avatar' | 'office'>('avatar');
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-300/80 shadow-xl transition-all">
      {/* Background Business Office Image with Executive Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('/fondo-empresarial.jpg')` }}
      >
        {/* Soft, crisp gradient overlay that guarantees 100% readability while revealing the modern office */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-900/85 to-emerald-950/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Subtle SENA Logo Watermark in Background */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-y-1/2 opacity-[0.06] select-none">
        <img src="/logo-sena.svg" alt="SENA Marca de Agua" className="w-[500px] h-[500px] object-contain" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title, Institutional Badges, Overview & Pastel Buttons */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5 text-white">
            
            {/* Top Badge Strip (SENA Green + Pastels) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white/95 border border-emerald-400 px-3.5 py-1.5 rounded-full shadow-md">
                <img src="/logo-sena.svg" alt="SENA" className="w-5 h-5 object-contain" />
                <span className="text-xs font-black text-[#39A900] tracking-wider uppercase">
                  SENA &bull; SERVICIO NACIONAL DE APRENDIZAJE
                </span>
              </div>

              <span className="bg-emerald-100/95 text-emerald-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
                Gestión Administrativa
              </span>

              <span className="bg-sky-100/95 text-sky-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-sky-300 shadow-2xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-800" />
                <span>40 Horas Formativas</span>
              </span>

              <span className="bg-amber-100/95 text-amber-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-amber-300 shadow-2xs">
                Escala A (70-100) / D (0-69)
              </span>
            </div>

            {/* Official Prominent Course Title */}
            <div className="space-y-1.5">
              <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Formación Virtual Institucional AVA
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4.5xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-sm">
                CÁTEDRA VIRTUAL DE PENSAMIENTO EMPRESARIAL
              </h1>
              <div className="text-emerald-300 font-extrabold text-base sm:text-lg lg:text-xl tracking-wide uppercase flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
                <span>MÓDULO I: MENTALIDAD EMPRESARIAL</span>
              </div>
            </div>

            {/* Pedagogical Brief */}
            <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed max-w-2xl font-normal">
              Entorno pedagógico integral para la calificación de las <strong>4 evidencias formativas</strong> de la Cátedra. Aplica las rúbricas analíticas oficiales, calcula el juicio cuantitativo y cualitativo según la escala del Reglamento del Aprendiz, y genera retroalimentaciones constructivas con <strong>nombre propio</strong> que reconocen el esfuerzo y orientan el plan de mejoramiento continuo.
            </p>

            {/* Pastel Evidence Badges (The 4 Evidences of the Course) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div
                onClick={() => onNavigateTab('evaluator')}
                className="bg-emerald-100/90 hover:bg-emerald-200/90 border border-emerald-300 rounded-2xl p-3 text-slate-900 cursor-pointer transition-all transform hover:-translate-y-0.5 shadow-md group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-200/80 px-1.5 py-0.2 rounded">
                    AA1-EV02
                  </span>
                  <FileText className="w-3.5 h-3.5 text-emerald-800" />
                </div>
                <div className="text-xs font-extrabold text-slate-900 leading-tight">
                  Informe Emprendimiento
                </div>
                <div className="text-[10px] text-emerald-800 mt-1 font-semibold">
                  Evidencia de Producto
                </div>
              </div>

              <div
                onClick={() => onNavigateTab('evaluator')}
                className="bg-sky-100/90 hover:bg-sky-200/90 border border-sky-300 rounded-2xl p-3 text-slate-900 cursor-pointer transition-all transform hover:-translate-y-0.5 shadow-md group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-sky-900 bg-sky-200/80 px-1.5 py-0.2 rounded">
                    AA2-EV01
                  </span>
                  <MessageSquare className="w-3.5 h-3.5 text-sky-800" />
                </div>
                <div className="text-xs font-extrabold text-slate-900 leading-tight">
                  Foro Presupuesto
                </div>
                <div className="text-[10px] text-sky-800 mt-1 font-semibold">
                  Rúbrica TIGRE (Conoc.)
                </div>
              </div>

              <div
                onClick={() => onNavigateTab('evaluator')}
                className="bg-purple-100/90 hover:bg-purple-200/90 border border-purple-300 rounded-2xl p-3 text-slate-900 cursor-pointer transition-all transform hover:-translate-y-0.5 shadow-md group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-200/80 px-1.5 py-0.2 rounded">
                    AA2-EV02
                  </span>
                  <Briefcase className="w-3.5 h-3.5 text-purple-800" />
                </div>
                <div className="text-xs font-extrabold text-slate-900 leading-tight">
                  Atributos de Negocio
                </div>
                <div className="text-[10px] text-purple-800 mt-1 font-semibold">
                  Matriz Tangibles/Intang.
                </div>
              </div>

              <div
                onClick={() => onNavigateTab('evaluator')}
                className="bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 rounded-2xl p-3 text-slate-900 cursor-pointer transition-all transform hover:-translate-y-0.5 shadow-md group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded">
                    AA2-EV03
                  </span>
                  <Video className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <div className="text-xs font-extrabold text-slate-900 leading-tight">
                  Video Presentación
                </div>
                <div className="text-[10px] text-amber-800 mt-1 font-semibold">
                  Elevator Pitch (Desemp.)
                </div>
              </div>
            </div>

            {/* Quick Action Buttons in Harmonious Pastels */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('evaluator')}
                className="px-5 py-3 bg-[#39A900] hover:bg-[#329600] text-white rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-lg transition-all transform active:scale-95"
              >
                <Award className="w-4 h-4 text-emerald-100" />
                <span>Calificar y Retroalimentar Aprendices</span>
              </button>

              <button
                onClick={() => onNavigateTab('extension')}
                className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Download className="w-4 h-4 text-purple-800" />
                <span>Descargar Extensión Chrome (Zajuna)</span>
              </button>

              <button
                onClick={() => onNavigateTab('learners')}
                className="px-4 py-3 bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <UserCheck className="w-4 h-4 text-sky-800" />
                <span>Ficha ({totalLearners} Aprendices)</span>
              </button>
            </div>
          </div>

          {/* Right Column: IMAGEN TAMAÑO GIGANTE DE LA INSTRUCTORA CON FONDO EMPRESARIAL */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Giant Instructor Photo Display Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] xl:max-w-[440px] group">
              
              {/* Outer Ambient Glow Ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/40 via-teal-300/30 to-emerald-400/50 rounded-[36px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Main Giant Portrait Card */}
              <div className="relative rounded-[32px] overflow-hidden border-4 border-white/90 shadow-2xl bg-gradient-to-b from-emerald-50 to-white">
                
                {/* The Giant Instructor Image */}
                <div className="h-[380px] sm:h-[450px] lg:h-[500px] xl:h-[530px] w-full relative overflow-hidden bg-emerald-100/50">
                  <img
                    src={selectedPhotoVersion === 'avatar' ? '/instructor-avatar.jpg' : '/portada-instructora.jpg'}
                    alt="Instructora Virtual SENA - Pensamiento Empresarial"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/src/assets/images/instructor_avatar_1791304253515.jpg';
                    }}
                  />

                  {/* Top-Right Badge: Official SENA Logo Pin */}
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-emerald-300 flex items-center gap-2">
                    <img src="/logo-sena.svg" alt="SENA" className="w-6 h-6 object-contain" />
                    <span className="text-[11px] font-black text-emerald-900 tracking-wider">SENA AVA</span>
                  </div>

                  {/* Top-Left Pill: Status */}
                  <div className="absolute top-3.5 left-3.5 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Instructora Virtual Activa</span>
                  </div>

                  {/* Bottom Glassmorphic Overlay Badge */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-transparent text-white pt-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                            Área de Gestión Administrativa
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                            {instructorName || 'Instructora Virtual SENA'}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-300 block">Progreso Ficha</span>
                          <span className="text-xs font-black text-emerald-400 font-mono">
                            {totalEvaluated} / {totalLearners} evaluados
                          </span>
                        </div>
                      </div>

                      {/* Warm Pedagogical Welcome Message */}
                      <div className="mt-2 pt-2 border-t border-white/15 text-[11px] text-slate-200 leading-snug italic">
                        "¡Bienvenido(a)! Valoremos el esfuerzo con nombre propio y guiemos a cada aprendiz hacia el éxito empresarial."
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Selector Switcher (Small pastel buttons to toggle between avatar & integrated office portrait) */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoVersion('avatar')}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all border ${
                    selectedPhotoVersion === 'avatar'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-xs font-extrabold'
                      : 'bg-white/80 text-slate-300 border-white/20 hover:bg-white/90 hover:text-slate-900'
                  }`}
                >
                  Retrato Institucional
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoVersion('office')}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all border ${
                    selectedPhotoVersion === 'office'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-xs font-extrabold'
                      : 'bg-white/80 text-slate-300 border-white/20 hover:bg-white/90 hover:text-slate-900'
                  }`}
                >
                  Entorno Empresarial
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
