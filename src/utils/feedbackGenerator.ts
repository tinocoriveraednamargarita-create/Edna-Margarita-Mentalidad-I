import { EvidenciaConfig, CriterioEvaluado, CalificacionEstado } from '../types';
import { INFORMACION_CURSO, PLANTILLAS_PEDAGOGICAS_AVA } from '../data/courseData';

export interface GenerarFeedbackParams {
  aprendizNombre: string;
  evidencia: EvidenciaConfig;
  criteriosEvaluados: CriterioEvaluado[];
  puntajeTotal: number;
  estado: CalificacionEstado;
  fortalezasSeleccionadas: string[];
  mejorasSeleccionadas: string[];
  observacionesPersonalizadas?: string;
  instructorNombre?: string;
  saludoIndice?: number;
}

export function generarRetroalimentacionTexto(params: GenerarFeedbackParams): string {
  const {
    aprendizNombre,
    evidencia,
    criteriosEvaluados,
    puntajeTotal,
    estado,
    fortalezasSeleccionadas,
    mejorasSeleccionadas,
    observacionesPersonalizadas,
    instructorNombre,
  } = params;

  const nombreLimpio = aprendizNombre.trim() || 'Estimado(a) Aprendiz';
  const esAprobado = estado === 'A';
  const firma = instructorNombre?.trim() || PLANTILLAS_PEDAGOGICAS_AVA.firmaDefault;

  const saludo = `Estimado(a) aprendiz ${nombreLimpio}, reciba un cordial saludo desde la virtualidad institucional de su centro de formación SENA.`;

  const reconocimiento = esAprobado
    ? `Agradezco y reconozco su notable esfuerzo, disciplina y compromiso demostrado en el desarrollo y entrega oportuna de la evidencia: "${evidencia.codigo} - ${evidencia.titulo}".`
    : `Agradezco su interés y dedicación al presentar la evidencia: "${evidencia.codigo} - ${evidencia.titulo}". El camino formativo y emprendedor es un proceso continuo de retroalimentación y perfeccionamiento.`;

  const juicioEvaluacion = `JUICIO DE EVALUACIÓN: ${esAprobado ? 'A - APROBADO' : 'D - NO APROBADO / DEFICIENTE'}\nCALIFICACIÓN CUANTITATIVA: ${puntajeTotal} / 100 puntos\nRESULTADO DE APRENDIZAJE: ${evidencia.rap}`;

  // Desglose de Criterios evaluados
  let desgloseCriterios = 'VALORACIÓN DETALLADA POR CRITERIOS DE RÚBRICA:\n';
  criteriosEvaluados.forEach((c) => {
    desgloseCriterios += `• ${c.criterioNombre}: [${c.nivelSeleccionado.toUpperCase()} - ${c.puntajeObtenido} pts]\n  ${c.observacionCriterio}\n`;
  });

  // Fortalezas
  let seccionFortalezas = '';
  if (fortalezasSeleccionadas.length > 0) {
    seccionFortalezas = 'ASPECTOS DESTACADOS Y FORTALEZAS IDENTIFICADAS:\n';
    fortalezasSeleccionadas.forEach((f) => {
      seccionFortalezas += `✓ ${f}\n`;
    });
  }

  // Mejoras y recomendaciones AVA
  let seccionMejoras = '';
  if (mejorasSeleccionadas.length > 0) {
    seccionMejoras = 'OPORTUNIDADES DE MEJORA Y RECOMENDACIONES PEDAGÓGICAS (GUÍA AVA):\n';
    mejorasSeleccionadas.forEach((m) => {
      seccionMejoras += `→ ${m}\n`;
    });
  }

  // Observación personalizada adicional
  let seccionPersonalizada = '';
  if (observacionesPersonalizadas && observacionesPersonalizadas.trim()) {
    seccionPersonalizada = `OBSERVACIONES ESPECÍFICAS DEL INSTRUCTOR:\n${observacionesPersonalizadas.trim()}\n`;
  }

  // Orientaciones de reenvío si es D
  let seccionReenvio = '';
  if (!esAprobado) {
    seccionReenvio = `INDICACIONES DE MEJORAMIENTO Y REENVÍO:\n${evidencia.instruccionesReenvio}\nRecuerde que dispone de la oportunidad de ajustar y reenviar su evidencia a través de la plataforma para alcanzar las competencias del resultado de aprendizaje.\n`;
  }

  // Despedida
  const despedida = esAprobado
    ? `Le motivo a continuar con este mismo entusiasmo y dedicación en el desarrollo de las siguientes evidencias de nuestra ${INFORMACION_CURSO.nombre}. Recuerde que estoy atento(a) a orientarle permanentemente a través del Foro de Dudas e Inquietudes y la mensajería interna institucional.`
    : `Ánimo, el error es parte fundamental del aprendizaje y la mentalidad emprendedora. Estoy a su entera disposición en los canales de atención institucional para apoyarle en las dudas que requiera para su reenvío exitoso.`;

  const bloques = [
    saludo,
    reconocimiento,
    '--------------------------------------------------',
    juicioEvaluacion,
    '--------------------------------------------------',
    desgloseCriterios.trim(),
  ];

  if (seccionFortalezas) bloques.push(seccionFortalezas.trim());
  if (seccionMejoras) bloques.push(seccionMejoras.trim());
  if (seccionPersonalizada) bloques.push(seccionPersonalizada.trim());
  if (seccionReenvio) bloques.push(seccionReenvio.trim());

  bloques.push('--------------------------------------------------');
  bloques.push(despedida);
  bloques.push(`\nAtentamente,\n\n${firma}`);

  return bloques.join('\n\n');
}

export function generarRetroalimentacionHTML(params: GenerarFeedbackParams): string {
  const {
    aprendizNombre,
    evidencia,
    criteriosEvaluados,
    puntajeTotal,
    estado,
    fortalezasSeleccionadas,
    mejorasSeleccionadas,
    observacionesPersonalizadas,
    instructorNombre,
  } = params;

  const nombreLimpio = aprendizNombre.trim() || 'Estimado(a) Aprendiz';
  const esAprobado = estado === 'A';
  const colorEstado = esAprobado ? '#2e7d32' : '#c62828';
  const badgeBg = esAprobado ? '#e8f5e9' : '#ffebee';
  const firma = (instructorNombre?.trim() || PLANTILLAS_PEDAGOGICAS_AVA.firmaDefault).replace(/\n/g, '<br/>');

  return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2d3748; max-width: 700px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
  <div style="background-color: #39A900; color: #ffffff; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px;">
    <strong style="font-size: 15px;">SENA - CÁTEDRA VIRTUAL DE PENSAMIENTO EMPRESARIAL</strong>
    <div style="font-size: 12px; opacity: 0.9;">Módulo I: Mentalidad Empresarial (40 Horas) | Gestión Administrativa</div>
  </div>

  <p><strong>Estimado(a) aprendiz ${nombreLimpio},</strong> reciba un cordial saludo desde la virtualidad institucional de su centro de formación SENA.</p>

  <p>${
    esAprobado
      ? `Agradezco y reconozco su notable esfuerzo, disciplina y compromiso demostrado en el desarrollo y entrega oportuna de la evidencia: <strong>${evidencia.codigo} - ${evidencia.titulo}</strong>.`
      : `Agradezco su interés y dedicación al presentar la evidencia: <strong>${evidencia.codigo} - ${evidencia.titulo}</strong>. El camino formativo y emprendedor es un proceso continuo de retroalimentación y perfeccionamiento constante.`
  }</p>

  <div style="background-color: ${badgeBg}; border-left: 4px solid ${colorEstado}; padding: 12px; margin: 16px 0; border-radius: 4px;">
    <div style="color: ${colorEstado}; font-weight: bold; font-size: 16px;">
      JUICIO DE EVALUACIÓN: ${esAprobado ? 'A - APROBADO' : 'D - NO APROBADO / DEFICIENTE'} (${puntajeTotal}/100 puntos)
    </div>
    <div style="font-size: 12px; color: #4a5568; margin-top: 4px;">
      <strong>Resultado de Aprendizaje (RAP):</strong> ${evidencia.rap}
    </div>
  </div>

  <h4 style="color: #2b6cb0; margin-bottom: 8px; margin-top: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Valoración Detallada por Criterios de Rúbrica:</h4>
  <ul style="padding-left: 20px; margin-top: 6px;">
    ${criteriosEvaluados
      .map(
        (c) => `
      <li style="margin-bottom: 8px;">
        <strong>${c.criterioNombre}:</strong> <span style="background-color: #edf2f7; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${c.nivelSeleccionado} (${c.puntajeObtenido} pts)</span><br/>
        <span style="color: #4a5568; font-size: 13px;">${c.observacionCriterio}</span>
      </li>
    `
      )
      .join('')}
  </ul>

  ${
    fortalezasSeleccionadas.length > 0
      ? `
    <h4 style="color: #2e7d32; margin-bottom: 8px; margin-top: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Aspectos Destacados y Fortalezas:</h4>
    <ul style="padding-left: 20px; color: #2d3748;">
      ${fortalezasSeleccionadas.map((f) => `<li style="margin-bottom: 4px;">✓ ${f}</li>`).join('')}
    </ul>
  `
      : ''
  }

  ${
    mejorasSeleccionadas.length > 0
      ? `
    <h4 style="color: #c05621; margin-bottom: 8px; margin-top: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Oportunidades de Mejora y Sugerencias Pedagógicas (Guía AVA):</h4>
    <ul style="padding-left: 20px; color: #2d3748;">
      ${mejorasSeleccionadas.map((m) => `<li style="margin-bottom: 4px;">→ ${m}</li>`).join('')}
    </ul>
  `
      : ''
  }

  ${
    observacionesPersonalizadas && observacionesPersonalizadas.trim()
      ? `
    <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 6px; padding: 10px; margin: 14px 0;">
      <strong style="color: #4a5568; font-size: 13px;">Observaciones Específicas del Instructor:</strong>
      <p style="margin: 4px 0 0 0; font-size: 13px;">${observacionesPersonalizadas.trim()}</p>
    </div>
  `
      : ''
  }

  ${
    !esAprobado
      ? `
    <div style="background-color: #fffaf0; border: 1px solid #feebc8; border-radius: 6px; padding: 12px; margin: 14px 0; color: #7b341e;">
      <strong>Plan de Mejoramiento y Reenvío:</strong>
      <p style="margin: 4px 0 0 0; font-size: 13px;">${evidencia.instruccionesReenvio}</p>
    </div>
  `
      : ''
  }

  <p style="margin-top: 16px;">${
    esAprobado
      ? `Le motivo a continuar con este mismo entusiasmo y dedicación en el desarrollo de las siguientes evidencias de nuestra <strong>Cátedra Virtual de Pensamiento Empresarial</strong>. Recuerde que estoy a su entera disposición a través del Foro de Dudas e Inquietudes y la mensajería interna institucional.`
      : `El error es una valiosa oportunidad de aprendizaje en la mentalidad emprendedora. Le invito a realizar los ajustes solicitados y reenviar su evidencia. Recuerde que cuenta con todo mi acompañamiento.`
  }</p>

  <p style="margin-top: 24px;">Atentamente,<br/><br/>
  <strong>${firma}</strong></p>
</div>
  `.trim();
}
