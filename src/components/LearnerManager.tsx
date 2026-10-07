import React, { useState } from 'react';
import { Aprendiz, CalificacionGuardada } from '../types';
import { EVIDENCIAS } from '../data/courseData';
import { UserPlus, Upload, Trash2, Download, Search, CheckCircle, Clock, ArrowUpRight, FileSpreadsheet } from 'lucide-react';

interface LearnerManagerProps {
  learners: Aprendiz[];
  setLearners: React.Dispatch<React.SetStateAction<Aprendiz[]>>;
  evaluations: CalificacionGuardada[];
  onSelectLearnerForGrading: (learnerName: string) => void;
}

export const LearnerManager: React.FC<LearnerManagerProps> = ({
  learners,
  setLearners,
  evaluations,
  onSelectLearnerForGrading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [newLearnerName, setNewLearnerName] = useState('');
  const [newLearnerDoc, setNewLearnerDoc] = useState('');

  // Sample learners generator
  const handleLoadSampleLearners = () => {
    const samples: Aprendiz[] = [
      { id: '1', nombreCompleto: 'Laura Sofía Martínez Gómez', documento: '1020304051', ficha: '2987654' },
      { id: '2', nombreCompleto: 'Carlos Eduardo Rodríguez Peña', documento: '1020304052', ficha: '2987654' },
      { id: '3', nombreCompleto: 'Valentina Castro Ospina', documento: '1020304053', ficha: '2987654' },
      { id: '4', nombreCompleto: 'Mateo Alejandro Torres Silva', documento: '1020304054', ficha: '2987654' },
      { id: '5', nombreCompleto: 'Daniela Herrera Sánchez', documento: '1020304055', ficha: '2987654' },
      { id: '6', nombreCompleto: 'Andrés Felipe Morales Díaz', documento: '1020304056', ficha: '2987654' },
      { id: '7', nombreCompleto: 'Camila Andrea Vargas Ruiz', documento: '1020304057', ficha: '2987654' },
      { id: '8', nombreCompleto: 'Santiago Mendoza Rincón', documento: '1020304058', ficha: '2987654' },
    ];
    setLearners(samples);
  };

  const handleAddSingleLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnerName.trim()) return;
    const newL: Aprendiz = {
      id: Date.now().toString(),
      nombreCompleto: newLearnerName.trim(),
      documento: newLearnerDoc.trim() || undefined,
    };
    setLearners((prev) => [...prev, newL]);
    setNewLearnerName('');
    setNewLearnerDoc('');
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n');
    const imported: Aprendiz[] = [];

    lines.forEach((line) => {
      const clean = line.trim();
      if (!clean) return;

      // Handle tab-separated (from Excel) or comma-separated
      const parts = clean.split(/[\t,;]/);
      if (parts.length >= 2) {
        // e.g. Document \t Name
        const doc = parts[0].trim();
        const name = parts.slice(1).join(' ').trim();
        imported.push({
          id: (Date.now() + Math.random()).toString(),
          nombreCompleto: name || doc,
          documento: name ? doc : undefined,
        });
      } else {
        imported.push({
          id: (Date.now() + Math.random()).toString(),
          nombreCompleto: clean,
        });
      }
    });

    setLearners((prev) => [...prev, ...imported]);
    setBulkText('');
    setIsImportModalOpen(false);
  };

  const handleRemoveLearner = (id: string) => {
    setLearners((prev) => prev.filter((l) => l.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('¿Está seguro de que desea eliminar todos los aprendices registrados?')) {
      setLearners([]);
    }
  };

  // Export report to CSV
  const handleExportCSV = () => {
    let csv = 'Documento,Nombre Completo,AA1-EV02,AA2-EV01,AA2-EV02,AA2-EV03,Promedio,Estado General\n';

    learners.forEach((l) => {
      const evAA1 = evaluations.find((e) => e.aprendizNombre === l.nombreCompleto && e.evidenciaId === 'AA1-EV02');
      const evAA21 = evaluations.find((e) => e.aprendizNombre === l.nombreCompleto && e.evidenciaId === 'AA2-EV01');
      const evAA22 = evaluations.find((e) => e.aprendizNombre === l.nombreCompleto && e.evidenciaId === 'AA2-EV02');
      const evAA23 = evaluations.find((e) => e.aprendizNombre === l.nombreCompleto && e.evidenciaId === 'AA2-EV03');

      const scores = [evAA1?.puntajeTotal, evAA21?.puntajeTotal, evAA22?.puntajeTotal, evAA23?.puntajeTotal].filter(
        (s): s is number => s !== undefined
      );
      const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'Sin datos';
      const generalStatus = avg !== 'Sin datos' && Number(avg) >= 70 ? 'A (Aprobado)' : 'En Progreso / D';

      csv += `"${l.documento || ''}","${l.nombreCompleto}","${evAA1 ? `${evAA1.estado} (${evAA1.puntajeTotal})` : 'Pendiente'}","${
        evAA21 ? `${evAA21.estado} (${evAA21.puntajeTotal})` : 'Pendiente'
      }","${evAA22 ? `${evAA22.estado} (${evAA22.puntajeTotal})` : 'Pendiente'}","${
        evAA23 ? `${evAA23.estado} (${evAA23.puntajeTotal})` : 'Pendiente'
      }","${avg}","${generalStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SENA_Calificaciones_Pensamiento_Empresarial_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const filteredLearners = learners.filter((l) =>
    l.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.documento && l.documento.includes(searchTerm))
  );

  return (
    <div className="space-y-4">
      {/* Top action cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Gestión de Aprendices & Calificaciones de la Ficha
            </h3>
            <p className="text-xs text-slate-500">
              Registre o pegue la lista de aprendices para realizar un seguimiento ágil de sus 4 evidencias.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-800" />
              <span>Importar Masivo (Excel/LMS)</span>
            </button>

            {learners.length === 0 && (
              <button
                onClick={handleLoadSampleLearners}
                className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Cargar Aprendices de Ejemplo</span>
              </button>
            )}

            {learners.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-amber-100/80 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
                <span>Exportar Reporte Excel/CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Add single learner form */}
        <form onSubmit={handleAddSingleLearner} className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center">
          <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Agregar uno:</span>
          </div>
          <input
            type="text"
            placeholder="Nombre completo del aprendiz..."
            value={newLearnerName}
            onChange={(e) => setNewLearnerName(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg flex-1 min-w-[200px]"
          />
          <input
            type="text"
            placeholder="Documento (Opcional)..."
            value={newLearnerDoc}
            onChange={(e) => setNewLearnerDoc(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg w-36"
          />
          <button
            type="submit"
            className="text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold px-3 py-1.5 rounded-lg"
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Learners list table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table filter header */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg w-full"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Total: <strong>{learners.length}</strong> aprendices
            </span>
            {learners.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Vaciar lista</span>
              </button>
            )}
          </div>
        </div>

        {learners.length === 0 ? (
          <div className="p-12 text-center">
            <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Aún no hay aprendices registrados</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Puede agregar aprendices manualmente, hacer clic en "Cargar Aprendices de Ejemplo", o pegar una lista completa copiada desde Excel o la plataforma institucional Zajuna.
            </p>
            <button
              onClick={handleLoadSampleLearners}
              className="mt-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Cargar 8 Aprendices de Prueba
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Aprendiz</th>
                  <th className="py-2.5 px-2 text-center" title="AA1-EV02: Informe">
                    AA1-EV02 (Informe)
                  </th>
                  <th className="py-2.5 px-2 text-center" title="AA2-EV01: Foro">
                    AA2-EV01 (Foro)
                  </th>
                  <th className="py-2.5 px-2 text-center" title="AA2-EV02: Ejercicio">
                    AA2-EV02 (Atributos)
                  </th>
                  <th className="py-2.5 px-2 text-center" title="AA2-EV03: Video">
                    AA2-EV03 (Video)
                  </th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLearners.map((learner, idx) => {
                  const ev1 = evaluations.find(
                    (e) => e.aprendizNombre === learner.nombreCompleto && e.evidenciaId === 'AA1-EV02'
                  );
                  const ev2 = evaluations.find(
                    (e) => e.aprendizNombre === learner.nombreCompleto && e.evidenciaId === 'AA2-EV01'
                  );
                  const ev3 = evaluations.find(
                    (e) => e.aprendizNombre === learner.nombreCompleto && e.evidenciaId === 'AA2-EV02'
                  );
                  const ev4 = evaluations.find(
                    (e) => e.aprendizNombre === learner.nombreCompleto && e.evidenciaId === 'AA2-EV03'
                  );

                  const renderEvidenceBadge = (ev: CalificacionGuardada | undefined) => {
                    if (!ev) {
                      return (
                        <span className="text-[10px] text-slate-400 font-medium">Pendiente</span>
                      );
                    }
                    const isA = ev.estado === 'A';
                    return (
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isA ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                        title={`${ev.puntajeTotal}/100 pts (${ev.fecha})`}
                      >
                        {ev.estado} ({ev.puntajeTotal})
                      </span>
                    );
                  };

                  return (
                    <tr key={learner.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-900">{learner.nombreCompleto}</div>
                        {learner.documento && (
                          <div className="text-[10px] text-slate-400 font-mono">CC: {learner.documento}</div>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center">{renderEvidenceBadge(ev1)}</td>
                      <td className="py-2 px-2 text-center">{renderEvidenceBadge(ev2)}</td>
                      <td className="py-2 px-2 text-center">{renderEvidenceBadge(ev3)}</td>
                      <td className="py-2 px-2 text-center">{renderEvidenceBadge(ev4)}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectLearnerForGrading(learner.nombreCompleto)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px] flex items-center gap-1"
                            title="Evaluar este aprendiz ahora"
                          >
                            <span>Evaluar</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveLearner(learner.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="Eliminar de la lista"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Import Modal with SENA watermark */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden border border-slate-200">
            {/* SENA Logo Watermark in Modal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] z-0">
              <img src="/logo-sena.svg" alt="SENA Marca de Agua" className="w-72 h-72 object-contain" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <img src="/logo-sena.svg" alt="SENA" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Importar Aprendices Masivamente
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Ficha Virtual &bull; Pensamiento Empresarial
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-3 mt-1">
                Pegue los nombres o la columna de aprendices copiada de su archivo Excel o de la plataforma institucional Zajuna (un aprendiz por línea):
              </p>

              <textarea
                rows={7}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Ejemplo:&#10;Laura Sofía Martínez&#10;Carlos Eduardo Rodríguez&#10;1020304050	Valentina Castro Ospina&#10;Mateo Alejandro Torres"
                className="w-full text-xs font-mono p-3 bg-slate-50/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#39A900] focus:bg-white mb-4"
              />

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Procesar e Importar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
