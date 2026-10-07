import React, { useState } from 'react';
import { Copy, Check, Sparkles, Download, RefreshCw, FileText, Code2, BookmarkCheck, ArrowRight } from 'lucide-react';
import { CalificacionEstado, EvidenciaConfig } from '../types';

interface FeedbackOutputProps {
  feedbackText: string;
  feedbackHtml: string;
  learnerName: string;
  evidencia: EvidenciaConfig;
  score: number;
  status: CalificacionEstado;
  onSaveToHistory: () => void;
  onNextLearner?: () => void;
  onEnhanceWithAI: () => Promise<void>;
  isEnhancingAI: boolean;
  onResetToTemplate: () => void;
  isAiEnhanced: boolean;
}

export const FeedbackOutput: React.FC<FeedbackOutputProps> = ({
  feedbackText,
  feedbackHtml,
  learnerName,
  evidencia,
  score,
  status,
  onSaveToHistory,
  onNextLearner,
  onEnhanceWithAI,
  isEnhancingAI,
  onResetToTemplate,
  isAiEnhanced,
}) => {
  const [copiedType, setCopiedType] = useState<'text' | 'html' | null>(null);
  const [activeView, setActiveView] = useState<'text' | 'html'>('text');
  const [editableText, setEditableText] = useState(feedbackText);

  // Sync if feedbackText changes and not manually modified
  React.useEffect(() => {
    setEditableText(feedbackText);
  }, [feedbackText]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  const handleCopyHtml = async () => {
    try {
      const type = 'text/html';
      const blob = new Blob([feedbackHtml], { type });
      const data = [new ClipboardItem({ [type]: blob, 'text/plain': new Blob([editableText], { type: 'text/plain' }) })];
      await navigator.clipboard.write(data);
      setCopiedType('html');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      // Fallback
      await navigator.clipboard.writeText(feedbackHtml);
      setCopiedType('html');
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleDownloadTxt = () => {
    const filename = `Retroalimentacion_${evidencia.codigo}_${learnerName.replace(/\s+/g, '_') || 'Aprendiz'}.txt`;
    const element = document.createElement('a');
    const file = new Blob([editableText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col h-full">
      {/* Header of the output */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-center p-1 shrink-0">
            <img src="/logo-sena.svg" alt="SENA" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Retroalimentación Pedagógica AVA</span>
              {isAiEnhanced && (
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-purple-700" /> Optimizada con IA
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              Personalizada para <strong className="text-emerald-800 font-bold">{learnerName || 'el Aprendiz'}</strong> con nombre propio y directrices SENA.
            </p>
          </div>
        </div>

        {/* View toggle in pastel tones */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveView('text')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeView === 'text'
                ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Texto Plano</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('html')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeView === 'html'
                ? 'bg-sky-100/90 text-sky-950 border border-sky-300 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-sky-700" />
            <span>Vista HTML</span>
          </button>
        </div>
      </div>

      {/* Main feedback box with subtle SENA watermark */}
      <div className="my-3 flex-1 min-h-[360px] flex flex-col relative">
        {/* Subtle Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] z-0 overflow-hidden">
          <img src="/logo-sena.svg" alt="SENA Marca de Agua" className="w-56 h-56 object-contain" />
        </div>

        {activeView === 'text' ? (
          <div className="relative flex-1 flex flex-col z-10">
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full flex-1 p-3 text-xs font-mono leading-relaxed bg-slate-50/80 backdrop-blur-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:bg-white resize-y min-h-[380px]"
              placeholder="La retroalimentación se generará automáticamente a medida que seleccione los criterios de la rúbrica..."
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Puede editar directamente el texto antes de copiarlo.</span>
              <span>{editableText.length} caracteres</span>
            </div>
          </div>
        ) : (
          <div
            className="flex-1 p-3 bg-slate-50/90 backdrop-blur-xs border border-slate-200 rounded-lg overflow-y-auto max-h-[460px] text-xs leading-relaxed z-10"
            dangerouslySetInnerHTML={{ __html: feedbackHtml }}
          />
        )}
      </div>

      {/* Action buttons toolbar in pastel tones */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {/* Primary copy row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              copiedType === 'text'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {copiedType === 'text' ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Copiado con Éxito al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Texto (Para Zajuna / LMS)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyHtml}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              copiedType === 'html'
                ? 'bg-sky-200 border-sky-400 text-sky-950 shadow-xs'
                : 'bg-sky-100/90 hover:bg-sky-200 text-sky-900 border-sky-300 shadow-2xs'
            }`}
          >
            {copiedType === 'html' ? (
              <>
                <Check className="w-4 h-4 text-sky-800" />
                <span>¡HTML Copiado!</span>
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4 text-sky-700" />
                <span>Copiar Formato Enriquecido (HTML)</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary utilities row in pastel palettes */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onEnhanceWithAI}
              disabled={isEnhancingAI}
              className="py-1.5 px-2.5 rounded-lg border border-purple-300 bg-purple-100/80 hover:bg-purple-200 text-purple-900 font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-60"
              title="Ajusta y estiliza la redacción con el Asistente Pedagógico SENA"
            >
              <Sparkles className={`w-3.5 h-3.5 text-purple-700 ${isEnhancingAI ? 'animate-spin' : ''}`} />
              <span>{isEnhancingAI ? 'Mejorando...' : 'Enriquecer con IA SENA'}</span>
            </button>

            {isAiEnhanced && (
              <button
                type="button"
                onClick={onResetToTemplate}
                className="py-1.5 px-2 rounded-lg border border-amber-300 bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                title="Volver a la plantilla exacta de rúbrica"
              >
                <RefreshCw className="w-3 h-3 text-amber-800" />
                <span>Reestablecer</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="py-1.5 px-2 rounded-lg border border-emerald-300 bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900 text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              title="Descargar archivo de texto"
            >
              <Download className="w-3 h-3 text-emerald-700" />
              <span>Descargar .txt</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSaveToHistory}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guardar Evaluación</span>
            </button>

            {onNextLearner && (
              <button
                type="button"
                onClick={onNextLearner}
                className="py-1.5 px-2.5 bg-indigo-100/90 hover:bg-indigo-200 text-indigo-950 border border-indigo-200 rounded-lg font-semibold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                title="Pasar al siguiente aprendiz de la lista"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3 h-3 text-indigo-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
