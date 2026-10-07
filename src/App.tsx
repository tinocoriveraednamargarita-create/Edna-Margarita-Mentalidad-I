import React, { useState, useEffect, useMemo } from 'react';
import { EvidenciaConfig, EvidenciaId, CalificacionEstado, Aprendiz, CalificacionGuardada, CriterioEvaluado } from './types';
import { EVIDENCIAS, INFORMACION_CURSO } from './data/courseData';
import { generarRetroalimentacionTexto, generarRetroalimentacionHTML } from './utils/feedbackGenerator';
import { Header } from './components/Header';
import { EvidenceSelector } from './components/EvidenceSelector';
import { RubricEvaluator } from './components/RubricEvaluator';
import { FeedbackOutput } from './components/FeedbackOutput';
import { LearnerManager } from './components/LearnerManager';
import { ChromeExtensionView } from './components/ChromeExtensionView';
import { HistoryView } from './components/HistoryView';
import { InstructorCard } from './components/InstructorCard';
import { MainHeroBanner } from './components/MainHeroBanner';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'evaluator' | 'learners' | 'extension' | 'history'>('evaluator');

  // Instructor profile
  const [instructorName, setInstructorName] = useState<string>(() => {
    return localStorage.getItem('sena_instructor_name') || 'Instructor(a) Virtual SENA - Gestión Administrativa';
  });

  // Current selected evidence
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenciaConfig>(EVIDENCIAS[0]);

  // Current learner name
  const [learnerName, setLearnerName] = useState<string>('Carlos Eduardo Rodríguez');

  // Learners directory
  const [learners, setLearners] = useState<Aprendiz[]>(() => {
    const saved = localStorage.getItem('sena_learners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: '1', nombreCompleto: 'Carlos Eduardo Rodríguez', documento: '1020304051', ficha: '2987654' },
      { id: '2', nombreCompleto: 'Laura Sofía Martínez Gómez', documento: '1020304052', ficha: '2987654' },
      { id: '3', nombreCompleto: 'Valentina Castro Ospina', documento: '1020304053', ficha: '2987654' },
      { id: '4', nombreCompleto: 'Mateo Alejandro Torres Silva', documento: '1020304054', ficha: '2987654' },
      { id: '5', nombreCompleto: 'Daniela Herrera Sánchez', documento: '1020304055', ficha: '2987654' },
    ];
  });

  // History of evaluations
  const [evaluations, setEvaluations] = useState<CalificacionGuardada[]>(() => {
    const saved = localStorage.getItem('sena_evaluations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Criteria ratings state for current evidence
  const [criteriaRatings, setCriteriaRatings] = useState<
    Record<string, 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'>
  >(() => {
    const initial: Record<string, 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'> = {};
    EVIDENCIAS[0].criterios.forEach((c) => {
      initial[c.id] = 'Excelente';
    });
    return initial;
  });

  // Strengths and improvements selection
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([
    EVIDENCIAS[0].fortalezasComunes[0],
    EVIDENCIAS[0].fortalezasComunes[1],
  ]);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([
    EVIDENCIAS[0].mejorasComunes[0],
  ]);
  const [customNotes, setCustomNotes] = useState<string>('');

  // AI enhancement state
  const [isEnhancingAI, setIsEnhancingAI] = useState<boolean>(false);
  const [aiEnhancedText, setAiEnhancedText] = useState<string | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('sena_instructor_name', instructorName);
  }, [instructorName]);

  useEffect(() => {
    localStorage.setItem('sena_learners', JSON.stringify(learners));
  }, [learners]);

  useEffect(() => {
    localStorage.setItem('sena_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  // When changing selected evidence, reset ratings & suggestions to defaults for that evidence
  const handleSelectEvidence = (evidencia: EvidenciaConfig) => {
    setSelectedEvidence(evidencia);
    const newRatings: Record<string, 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente'> = {};
    evidencia.criterios.forEach((c) => {
      newRatings[c.id] = 'Excelente';
    });
    setCriteriaRatings(newRatings);
    setSelectedStrengths([evidencia.fortalezasComunes[0] || '']);
    setSelectedImprovements([evidencia.mejorasComunes[0] || '']);
    setCustomNotes('');
    setAiEnhancedText(null);
  };

  // Calculate score and status
  const { totalScore, status, criteriosEvaluados } = useMemo(() => {
    let scoreSum = 0;
    const evaluatedList: CriterioEvaluado[] = [];

    selectedEvidence.criterios.forEach((crit) => {
      const levelName = criteriaRatings[crit.id] || 'Excelente';
      const levelObj = crit.niveles.find((n) => n.nivel === levelName) || crit.niveles[0];
      const points = levelObj.puntos;
      scoreSum += (points * crit.peso) / 100;

      evaluatedList.push({
        criterioId: crit.id,
        criterioNombre: crit.nombre,
        nivelSeleccionado: levelName,
        puntajeObtenido: points,
        peso: crit.peso,
        observacionCriterio: levelObj.observacionSugerida,
      });
    });

    const roundedScore = Math.round(scoreSum);
    const evalStatus: CalificacionEstado = roundedScore >= 70 ? 'A' : 'D';

    return {
      totalScore: roundedScore,
      status: evalStatus,
      criteriosEvaluados: evaluatedList,
    };
  }, [selectedEvidence, criteriaRatings]);

  // Generate feedback text and HTML
  const standardFeedbackText = useMemo(() => {
    return generarRetroalimentacionTexto({
      aprendizNombre: learnerName,
      evidencia: selectedEvidence,
      criteriosEvaluados,
      puntajeTotal: totalScore,
      estado: status,
      fortalezasSeleccionadas: selectedStrengths,
      mejorasSeleccionadas: selectedImprovements,
      observacionesPersonalizadas: customNotes,
      instructorNombre: instructorName,
    });
  }, [
    learnerName,
    selectedEvidence,
    criteriosEvaluados,
    totalScore,
    status,
    selectedStrengths,
    selectedImprovements,
    customNotes,
    instructorName,
  ]);

  const feedbackHtml = useMemo(() => {
    return generarRetroalimentacionHTML({
      aprendizNombre: learnerName,
      evidencia: selectedEvidence,
      criteriosEvaluados,
      puntajeTotal: totalScore,
      estado: status,
      fortalezasSeleccionadas: selectedStrengths,
      mejorasSeleccionadas: selectedImprovements,
      observacionesPersonalizadas: customNotes,
      instructorNombre: instructorName,
    });
  }, [
    learnerName,
    selectedEvidence,
    criteriosEvaluados,
    totalScore,
    status,
    selectedStrengths,
    selectedImprovements,
    customNotes,
    instructorName,
  ]);

  const activeFeedbackText = aiEnhancedText || standardFeedbackText;

  // Handle saving to evaluation history
  const handleSaveToHistory = () => {
    const newRecord: CalificacionGuardada = {
      id: Date.now().toString(),
      aprendizId: Date.now().toString(),
      aprendizNombre: learnerName.trim() || 'Aprendiz',
      evidenciaId: selectedEvidence.id,
      puntajeTotal: totalScore,
      estado: status,
      criterios: criteriosEvaluados,
      fortalezasSeleccionadas: selectedStrengths,
      mejorasSeleccionadas: selectedImprovements,
      notasPersonalizadas: customNotes,
      retroalimentacionTexto: activeFeedbackText,
      fecha: new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setEvaluations((prev) => [newRecord, ...prev]);
    showToast(`Evaluación de ${newRecord.aprendizNombre} archivada con éxito.`, 'success');
  };

  // Move to next learner in list
  const handleNextLearner = () => {
    if (learners.length === 0) return;
    const currentIndex = learners.findIndex((l) => l.nombreCompleto === learnerName);
    const nextIndex = (currentIndex + 1) % learners.length;
    setLearnerName(learners[nextIndex].nombreCompleto);
    setAiEnhancedText(null);
    showToast(`Aprendiz cargado: ${learners[nextIndex].nombreCompleto}`, 'info');
  };

  const handleSelectLearnerForGrading = (name: string) => {
    setLearnerName(name);
    setActiveTab('evaluator');
    showToast(`Aprendiz seleccionado: ${name}`, 'info');
  };

  // Enhance feedback with AI
  const handleEnhanceWithAI = async () => {
    setIsEnhancingAI(true);
    try {
      const response = await fetch('/api/enhance-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: learnerName,
          evidenceId: selectedEvidence.codigo,
          evidenceTitle: selectedEvidence.titulo,
          score: totalScore,
          status,
          criteriaFeedback: criteriosEvaluados,
          strengths: selectedStrengths.join('; '),
          improvements: selectedImprovements.join('; '),
          customNotes,
          instructorName,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      if (data.enhancedText) {
        setAiEnhancedText(data.enhancedText);
        showToast('¡Retroalimentación refinada y enriquecida con IA SENA!', 'success');
      } else {
        showToast('Motor pedagógico institucional aplicado.', 'info');
      }
    } catch (error) {
      console.warn('AI enhancement fallback:', error);
      showToast('Se mantiene la plantilla institucional con las directrices AVA.', 'info');
    } finally {
      setIsEnhancingAI(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-['Work_Sans',sans-serif]">
      {/* Institutional SENA Header */}
      <Header
        instructorName={instructorName}
        setInstructorName={setInstructorName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalEvaluated={evaluations.length}
        totalLearners={learners.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Main Hero Banner with SENA logo, instructor portrait, pastel badges */}
        <MainHeroBanner
          instructorName={instructorName}
          onNavigateTab={setActiveTab}
          totalEvaluated={evaluations.length}
          totalLearners={learners.length}
        />

        {activeTab === 'evaluator' && (
          <div className="space-y-4">
            {/* Evidence Selector Bar */}
            <EvidenceSelector
              selectedEvidenceId={selectedEvidence.id}
              onSelectEvidence={handleSelectEvidence}
            />

            {/* Split Screen 2-Columns: Rubric Matrix & Feedback Live Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column (Rubric Evaluator) */}
              <div className="lg:col-span-7">
                <RubricEvaluator
                  evidencia={selectedEvidence}
                  learnerName={learnerName}
                  setLearnerName={setLearnerName}
                  criteriaRatings={criteriaRatings}
                  setCriteriaRatings={setCriteriaRatings}
                  selectedStrengths={selectedStrengths}
                  setSelectedStrengths={setSelectedStrengths}
                  selectedImprovements={selectedImprovements}
                  setSelectedImprovements={setSelectedImprovements}
                  customNotes={customNotes}
                  setCustomNotes={setCustomNotes}
                  totalScore={totalScore}
                  status={status}
                  availableLearners={learners}
                  onSelectLearnerFromList={(name) => setLearnerName(name)}
                />
              </div>

              {/* Right Column (Instructor Avatar Card & Feedback Output) */}
              <div className="lg:col-span-5 sticky top-20 space-y-4">
                {/* Instructor Image & AVA Tutoring Card on the Right Side */}
                <InstructorCard
                  instructorName={instructorName}
                  evidencia={selectedEvidence}
                />

                <FeedbackOutput
                  feedbackText={activeFeedbackText}
                  feedbackHtml={feedbackHtml}
                  learnerName={learnerName}
                  evidencia={selectedEvidence}
                  score={totalScore}
                  status={status}
                  onSaveToHistory={handleSaveToHistory}
                  onNextLearner={learners.length > 1 ? handleNextLearner : undefined}
                  onEnhanceWithAI={handleEnhanceWithAI}
                  isEnhancingAI={isEnhancingAI}
                  onResetToTemplate={() => setAiEnhancedText(null)}
                  isAiEnhanced={Boolean(aiEnhancedText)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learners' && (
          <LearnerManager
            learners={learners}
            setLearners={setLearners}
            evaluations={evaluations}
            onSelectLearnerForGrading={handleSelectLearnerForGrading}
          />
        )}

        {activeTab === 'extension' && <ChromeExtensionView />}

        {activeTab === 'history' && (
          <HistoryView evaluations={evaluations} setEvaluations={setEvaluations} />
        )}
      </main>

      {/* Toast Notification with SENA icon */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold text-white transition-all transform animate-bounce bg-slate-900/95 backdrop-blur-md border border-slate-700 relative overflow-hidden">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center p-0.5 shrink-0">
            <img src="/logo-sena.svg" alt="SENA" className="w-4 h-4" />
          </div>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span className="pr-1">{toastMessage.text}</span>
        </div>
      )}

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#39A900]">SENA</span>
            <span>&bull;</span>
            <span>Centro de Gestión Administrativa</span>
            <span>&bull;</span>
            <span>Formación Virtual (AVA)</span>
          </div>
          <div>
            <span>Cátedra Virtual de Pensamiento Empresarial - Módulo I: Mentalidad Empresarial (40 Horas)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
