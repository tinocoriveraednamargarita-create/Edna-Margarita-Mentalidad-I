export type EvidenciaId = 'AA1-EV02' | 'AA2-EV01' | 'AA2-EV02' | 'AA2-EV03';

export type CalificacionEstado = 'A' | 'D'; // A: Aprobado (70-100), D: No Aprobado / Deficiente (0-69)

export interface CriterioRúbrica {
  id: string;
  nombre: string;
  descripcion: string;
  peso: number; // Porcentaje (suma 100%)
  niveles: {
    nivel: 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente';
    puntos: number;
    descripcion: string;
    observacionSugerida: string;
  }[];
}

export interface EvidenciaConfig {
  id: EvidenciaId;
  codigo: string;
  tipo: 'Evidencia de producto' | 'Evidencia de conocimiento' | 'Evidencia de desempeño';
  titulo: string;
  actividadAprendizaje: string;
  rap: string; // Resultado de Aprendizaje
  duracionEstimada: string;
  descripcion: string;
  criterios: CriterioRúbrica[];
  fortalezasComunes: string[];
  mejorasComunes: string[];
  instruccionesReenvio: string;
}

export interface CriterioEvaluado {
  criterioId: string;
  criterioNombre: string;
  nivelSeleccionado: 'Excelente' | 'Bueno' | 'Regular' | 'Insuficiente';
  puntajeObtenido: number;
  peso: number;
  observacionCriterio: string;
}

export interface Aprendiz {
  id: string;
  documento?: string;
  nombreCompleto: string;
  ficha?: string;
  correo?: string;
}

export interface CalificacionGuardada {
  id: string;
  aprendizId: string;
  aprendizNombre: string;
  evidenciaId: EvidenciaId;
  puntajeTotal: number;
  estado: CalificacionEstado;
  criterios: CriterioEvaluado[];
  fortalezasSeleccionadas: string[];
  mejorasSeleccionadas: string[];
  notasPersonalizadas: string;
  retroalimentacionTexto: string;
  fecha: string;
}
