import React, { useState } from 'react';
import {
  generateExtensionZip,
  getManifestJSON,
  getPopupHTML,
  getPopupJS,
  getContentJS,
  getReadmeTXT,
} from '../utils/extensionGenerator';
import {
  Download,
  CheckCircle2,
  ExternalLink,
  Code2,
  Play,
  Monitor,
  Copy,
  FolderArchive,
  Terminal,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { EVIDENCIAS } from '../data/courseData';

export const ChromeExtensionView: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'manifest' | 'popupHtml' | 'popupJs' | 'contentJs' | 'readme'>('manifest');
  const [copiedCode, setCopiedCode] = useState(false);

  // Simulator state inside this view
  const [simLearner, setSimLearner] = useState('Juan David Gómez');
  const [simEvidence, setSimEvidence] = useState(EVIDENCIAS[0].id);
  const [simStatusMsg, setSimStatusMsg] = useState('');
  const [simCopied, setSimCopied] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zipBlob = await generateExtensionZip();
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SENA_Evaluador_AVA_Extension_Chrome.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating extension ZIP:', error);
      alert('Error al generar el archivo ZIP de la extensión.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getCodeContent = () => {
    switch (activeCodeTab) {
      case 'manifest':
        return getManifestJSON();
      case 'popupHtml':
        return getPopupHTML();
      case 'popupJs':
        return getPopupJS();
      case 'contentJs':
        return getContentJS();
      case 'readme':
        return getReadmeTXT();
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimCopy = () => {
    setSimCopied(true);
    setSimStatusMsg('¡Copiado al portapapeles!');
    setTimeout(() => {
      setSimCopied(false);
      setSimStatusMsg('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero extension banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-3">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Extensión Oficial Manifest V3 para Google Chrome</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            SENA Evaluador AVA &bull; Extensión de Chrome
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
            Califique directamente sobre la plataforma institucional <strong>Zajuna / Territorium</strong> sin cambiar de pestaña. Al hacer clic en el ícono de la extensión en Chrome, evalúa con las rúbricas institucionales, genera el comentario con nombre propio y lo inyecta con un solo clic.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-5 py-3 bg-[#39A900] hover:bg-[#329600] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg transition-all transform active:scale-95 disabled:opacity-75"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generando paquete ZIP...' : 'Descargar Extensión para Chrome (.ZIP)'}</span>
            </button>

            <a
              href="#guia-instalacion"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
            >
              Ver Guía de Instalación (5 Pasos)
            </a>
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden lg:block">
          <FolderArchive className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* 2-Column layout: Step by Step Guide & Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5-Step Installation Guide */}
        <div id="guia-instalacion" className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instalación en Google Chrome (Modo Desarrollador)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              La extensión utiliza el estándar moderno <strong>Manifest V3</strong> y no requiere tienda externa. Se instala en menos de 1 minuto:
            </p>

            <div className="space-y-3.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Descargar y Descomprimir</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Haga clic en el botón superior <strong>"Descargar Extensión para Chrome (.ZIP)"</strong> y extraiga los archivos en una carpeta de su computador (ejemplo: <code className="bg-slate-200 px-1 py-0.2 rounded text-[11px]">C:\SENA\Extension-Evaluador</code>).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Abrir el Administrador de Extensiones</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    En una nueva pestaña de Google Chrome, copie y pegue la dirección:{' '}
                    <code className="bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded text-xs select-all">
                      chrome://extensions/
                    </code>{' '}
                    y presione Enter.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Activar Modo de desarrollador</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    En la esquina <strong>superior derecha</strong> de la pantalla de extensiones de Chrome, active el interruptor marcado como <strong>"Modo de desarrollador"</strong> (Developer mode).
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Cargar descomprimida</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Haga clic en el botón <strong>"Cargar descomprimida"</strong> (Load unpacked) en la esquina superior izquierda y seleccione la carpeta que extrajo en el paso 1.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-7 h-7 rounded-full bg-[#39A900] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">¡Listo! Fijar y Utilizar en Zajuna</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Haga clic en el ícono de rompecabezas en Chrome y fije (Pin 📌) el <strong>SENA Evaluador AVA</strong>. Al entrar a la entrega de un aprendiz en Zajuna, abra la extensión para evaluar y pegar la retroalimentación al instante.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Extension Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-emerald-600" />
                <span>Simulador del Popup de Chrome</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                480 x 580 px
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Así es exactamente como se ve y funciona la extensión cuando el instructor hace clic en su ícono de Chrome:
            </p>

            {/* Popup window container mockup with SENA watermark */}
            <div className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-xl bg-slate-50 relative">
              {/* Subtle SENA Watermark in simulated popup */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] z-0 overflow-hidden">
                <img src="/logo-sena.svg" alt="SENA Marca de Agua" className="w-64 h-64 object-contain" />
              </div>

              {/* Chrome popup top bar */}
              <div className="bg-[#39A900] text-white px-3.5 py-2.5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-0.5 rounded shadow-2xs">
                    <img src="/logo-sena.svg" alt="SENA" className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs leading-tight">Evaluador AVA</div>
                    <div className="text-[9px] opacity-90">Cátedra Pensamiento Empresarial</div>
                  </div>
                </div>
                <div className="bg-[#277800] text-white text-xs font-bold px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
                  A (100 pts)
                </div>
              </div>

              {/* Popup inner form */}
              <div className="p-3.5 space-y-2.5 text-xs bg-slate-50/80 backdrop-blur-2xs relative z-10">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Nombre del Aprendiz:
                  </label>
                  <input
                    type="text"
                    value={simLearner}
                    onChange={(e) => setSimLearner(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white/95 text-slate-800 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Nombre completo..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Evidencia a Calificar:
                  </label>
                  <select
                    value={simEvidence}
                    onChange={(e) => setSimEvidence(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white/95 text-slate-800"
                  >
                    {EVIDENCIAS.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.codigo}: {ev.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rubric criteria pill mockup in pastel tones */}
                <div className="bg-white/95 border border-slate-200 rounded-xl p-2.5 text-[11px] shadow-2xs">
                  <div className="font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Criterios de Evaluación</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      4 evaluados
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-700 truncate max-w-[190px]">Perfil emprendedor</span>
                      <span className="bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                        Excelente (100)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-700 truncate max-w-[190px]">Casos reales</span>
                      <span className="bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                        Excelente (100)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-700 truncate max-w-[190px]">Autodiagnóstico</span>
                      <span className="bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                        Excelente (100)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview text with subtle watermark background */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Retroalimentación Generada (Nombre Propio):
                  </label>
                  <div className="bg-white/90 border border-slate-300 rounded-xl p-2.5 text-[10px] font-mono text-slate-700 h-28 overflow-y-auto leading-relaxed shadow-inner">
                    Estimado(a) aprendiz {simLearner || 'Aprendiz'}, cordial saludo desde la virtualidad institucional SENA.
                    <br /><br />
                    Agradezco y reconozco su notable esfuerzo, disciplina y compromiso demostrado en el desarrollo de la evidencia: "{simEvidence}".
                    <br /><br />
                    JUICIO DE EVALUACIÓN: A - APROBADO (100 / 100 puntos)
                    <br /><br />
                    ASPECTOS DESTACADOS Y FORTALEZAS:
                    <br />
                    ✓ Excelente apropiación conceptual y análisis contextual.
                    <br /><br />
                    OPORTUNIDADES DE MEJORA (GUÍA AVA):
                    <br />
                    → Vincular sus competencias personales con acciones concretas.
                  </div>
                </div>

                {/* Actions row in pastel color palette */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleSimCopy}
                    className="py-2.5 px-2 bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{simCopied ? '¡Copiado!' : '📋 Copiar Texto'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSimCopy();
                      alert('Simulación: La retroalimentación se inyectó en el campo de texto de comentarios de Zajuna.');
                    }}
                    className="py-2.5 px-2 bg-sky-100/90 hover:bg-sky-200 text-sky-950 border border-sky-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-800" />
                    <span>⚡ Inyectar Zajuna</span>
                  </button>
                </div>

                {simStatusMsg && (
                  <div className="text-center text-[11px] font-bold text-emerald-800 bg-emerald-100/80 py-1 rounded-lg border border-emerald-200">
                    {simStatusMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs (Manifest V3, Popup HTML, Popup JS, Content Script) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-600" />
              <span>Explorador de Archivos de la Extensión</span>
            </h3>
            <p className="text-xs text-slate-500">
              Revise o copie el código fuente individual incluido en el archivo comprimido.
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedCode ? '¡Código Copiado!' : 'Copiar este Archivo'}</span>
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex gap-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCodeTab('manifest')}
            className={`px-3 py-1.5 font-mono font-semibold rounded-t-md transition-colors ${
              activeCodeTab === 'manifest'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            manifest.json (V3)
          </button>
          <button
            onClick={() => setActiveCodeTab('popupHtml')}
            className={`px-3 py-1.5 font-mono font-semibold rounded-t-md transition-colors ${
              activeCodeTab === 'popupHtml'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            popup.html
          </button>
          <button
            onClick={() => setActiveCodeTab('popupJs')}
            className={`px-3 py-1.5 font-mono font-semibold rounded-t-md transition-colors ${
              activeCodeTab === 'popupJs'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            popup.js
          </button>
          <button
            onClick={() => setActiveCodeTab('contentJs')}
            className={`px-3 py-1.5 font-mono font-semibold rounded-t-md transition-colors ${
              activeCodeTab === 'contentJs'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            content.js (Inyección LMS)
          </button>
          <button
            onClick={() => setActiveCodeTab('readme')}
            className={`px-3 py-1.5 font-mono font-semibold rounded-t-md transition-colors ${
              activeCodeTab === 'readme'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            README.txt
          </button>
        </div>

        {/* Code viewer */}
        <div className="mt-2 bg-slate-900 text-slate-100 p-4 rounded-b-xl rounded-tr-xl font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
          <pre>{getCodeContent()}</pre>
        </div>
      </div>
    </div>
  );
};
