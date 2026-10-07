import JSZip from 'jszip';
import { EVIDENCIAS, INFORMACION_CURSO, PLANTILLAS_PEDAGOGICAS_AVA } from '../data/courseData';

export function getManifestJSON(): string {
  return JSON.stringify(
    {
      manifest_version: 3,
      name: 'SENA Evaluador AVA - Pensamiento Empresarial',
      version: '1.0.0',
      description:
        'Extensión para instructores virtuales SENA: califica y genera retroalimentaciones pedagógicas con rúbrica AVA para Cátedra de Pensamiento Empresarial.',
      permissions: ['activeTab', 'storage', 'clipboardWrite', 'scripting'],
      host_permissions: [
        '*://*.sena.edu.co/*',
        '*://zajuna.sena.edu.co/*',
        '*://*.territorio.la/*',
        '*://*.blackboard.com/*',
      ],
      action: {
        default_popup: 'popup.html',
        default_title: 'SENA Evaluador AVA',
        default_icon: {
          '16': 'icon16.png',
          '48': 'icon48.png',
          '128': 'icon128.png',
        },
      },
      content_scripts: [
        {
          matches: [
            '*://*.sena.edu.co/*',
            '*://zajuna.sena.edu.co/*',
            '*://*.territorio.la/*',
            '*://*.blackboard.com/*',
          ],
          js: ['content.js'],
          css: ['content.css'],
        },
      ],
    },
    null,
    2
  );
}

export function getPopupHTML(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>SENA Evaluador AVA</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <header class="header">
    <div class="logo-box">
      <div class="sena-badge">SENA</div>
      <div>
        <h1>Evaluador AVA</h1>
        <small>Cátedra Pensamiento Empresarial</small>
      </div>
    </div>
    <div class="score-badge" id="scoreBadge">A (100 pts)</div>
  </header>

  <main class="content">
    <div class="field-group">
      <label for="learnerName">Nombre del Aprendiz:</label>
      <input type="text" id="learnerName" placeholder="Ej: Juan Carlos Pérez Gómez" autofocus>
    </div>

    <div class="field-group">
      <label for="evidenceSelect">Evidencia a Calificar:</label>
      <select id="evidenceSelect">
        <option value="AA1-EV02">AA1-EV02: Informe "Analizando el emprendimiento"</option>
        <option value="AA2-EV01">AA2-EV01: Foro "Presupuesto de promoción"</option>
        <option value="AA2-EV02">AA2-EV02: Ejercicio "Atributos de idea de negocio"</option>
        <option value="AA2-EV03">AA2-EV03: Video "Presentación idea de negocio"</option>
      </select>
    </div>

    <div class="rubric-section">
      <div class="section-title">Criterios de Evaluación:</div>
      <div id="criteriaContainer" class="criteria-container"></div>
    </div>

    <div class="field-group">
      <label>Fortalezas encontradas:</label>
      <div id="strengthsContainer" class="checkbox-list"></div>
    </div>

    <div class="field-group">
      <label>Oportunidades de Mejora (Guía AVA):</label>
      <div id="improvementsContainer" class="checkbox-list"></div>
    </div>

    <div class="field-group">
      <label for="customNotes">Observación adicional (Opcional):</label>
      <input type="text" id="customNotes" placeholder="Comentario particular para el aprendiz...">
    </div>

    <div class="feedback-preview-box">
      <div class="preview-header">
        <label>Retroalimentación Generada:</label>
        <button type="button" class="btn-sm" id="btnPreviewToggle">Ver Completa</button>
      </div>
      <textarea id="feedbackPreview" rows="6" readonly></textarea>
    </div>

    <div class="actions-row">
      <button type="button" class="btn btn-primary" id="btnCopyText">📋 Copiar Retroalimentación</button>
      <button type="button" class="btn btn-secondary" id="btnInjectLms" title="Pegar automáticamente en el campo de texto de Zajuna">⚡ Inyectar en Zajuna</button>
    </div>
    <div id="statusMsg" class="status-msg"></div>
  </main>

  <footer class="footer">
    <span>Gestión Administrativa | 40 Horas</span>
  </footer>

  <script src="popup.js"></script>
</body>
</html>`;
}

export function getPopupCSS(): string {
  return `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
body {
  width: 480px;
  background-color: #f8fafc;
  color: #1e293b;
  font-size: 13px;
  position: relative;
}
body::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  background-image: url('icon.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
}
.header {
  background: #39A900;
  color: white;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}
.logo-box {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sena-badge {
  background: white;
  color: #39A900;
  font-weight: 800;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  letter-spacing: 0.5px;
}
.header h1 {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
}
.header small {
  font-size: 10px;
  opacity: 0.9;
}
.score-badge {
  background: #277800;
  color: white;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
}
.content {
  padding: 14px;
  max-height: 520px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}
.field-group {
  margin-bottom: 12px;
}
label {
  display: block;
  font-weight: 600;
  font-size: 12px;
  color: #334155;
  margin-bottom: 4px;
}
input[type="text"], select, textarea {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  background-color: white;
  color: #1e293b;
}
input[type="text"]:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #39A900;
  box-shadow: 0 0 0 2px rgba(57, 169, 0, 0.2);
}
.rubric-section {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
}
.section-title {
  font-weight: 700;
  font-size: 12px;
  color: #0f172a;
  margin-bottom: 8px;
}
.criterion-row {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e2e8f0;
}
.criterion-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.criterion-name {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 4px;
}
.levels-group {
  display: flex;
  gap: 4px;
}
.level-btn {
  flex: 1;
  padding: 5px 2px;
  font-size: 10px;
  border: 1px solid #cbd5e1;
  background: #f1f5f9;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  transition: all 0.15s ease;
}
.level-btn.active {
  background: #a7f3d0 !important;
  color: #064e3b !important;
  border-color: #34d399 !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  font-weight: 700;
}
.level-btn.active-bueno {
  background: #bae6fd !important;
  color: #0c4a6e !important;
  border-color: #38bdf8 !important;
  font-weight: 700;
}
.level-btn.active-regular {
  background: #fde68a !important;
  color: #78350f !important;
  border-color: #fbbf24 !important;
  font-weight: 700;
}
.level-btn.active-insuficiente {
  background: #fecdd3 !important;
  color: #881337 !important;
  border-color: #fb7185 !important;
  font-weight: 700;
}
.checkbox-list {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 10px;
  max-height: 90px;
  overflow-y: auto;
}
.checkbox-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 11px;
  color: #475569;
}
.checkbox-item input {
  margin-top: 2px;
}
.feedback-preview-box {
  margin-bottom: 12px;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.btn-sm {
  font-size: 10px;
  background: #e2e8f0;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}
textarea {
  font-family: monospace;
  font-size: 11px;
  background-color: #f8fafc;
  resize: vertical;
}
.actions-row {
  display: flex;
  gap: 8px;
}
.btn {
  flex: 1;
  padding: 9px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}
.btn-primary {
  background: #a7f3d0;
  color: #064e3b;
  border-color: #6ee7b7;
}
.btn-secondary {
  background: #bae6fd;
  color: #0c4a6e;
  border-color: #7dd3fc;
}
.status-msg {
  text-align: center;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  min-height: 16px;
}
.status-success {
  color: #16a34a;
}
.footer {
  border-top: 1px solid #e2e8f0;
  padding: 8px 14px;
  background: white;
  font-size: 10px;
  color: #64748b;
  text-align: center;
  position: relative;
  z-index: 1;
}`;
}

export function getPopupJS(): string {
  const evidenciasJson = JSON.stringify(EVIDENCIAS);
  const infoJson = JSON.stringify(INFORMACION_CURSO);
  const plantillasJson = JSON.stringify(PLANTILLAS_PEDAGOGICAS_AVA);

  return `
const EVIDENCIAS = ${evidenciasJson};
const INFO = ${infoJson};
const PLANTILLAS = ${plantillasJson};

let currentEvidence = EVIDENCIAS[0];
let criteriaState = {};
let selectedStrengths = [];
let selectedImprovements = [];

const learnerInput = document.getElementById('learnerName');
const evidenceSelect = document.getElementById('evidenceSelect');
const criteriaContainer = document.getElementById('criteriaContainer');
const strengthsContainer = document.getElementById('strengthsContainer');
const improvementsContainer = document.getElementById('improvementsContainer');
const customNotesInput = document.getElementById('customNotes');
const feedbackPreview = document.getElementById('feedbackPreview');
const scoreBadge = document.getElementById('scoreBadge');
const statusMsg = document.getElementById('statusMsg');

function init() {
  // Load saved instructor or state if available
  chrome.storage.local.get(['instructorName', 'lastLearner'], (data) => {
    if (data.lastLearner) learnerInput.value = data.lastLearner;
    loadEvidence(evidenceSelect.value);
  });

  evidenceSelect.addEventListener('change', () => {
    loadEvidence(evidenceSelect.value);
  });

  learnerInput.addEventListener('input', () => {
    chrome.storage.local.set({ lastLearner: learnerInput.value });
    updateFeedback();
  });

  customNotesInput.addEventListener('input', updateFeedback);

  document.getElementById('btnCopyText').addEventListener('click', copyFeedback);
  document.getElementById('btnInjectLms').addEventListener('click', injectIntoLMS);
}

function loadEvidence(evidenceId) {
  currentEvidence = EVIDENCIAS.find(e => e.id === evidenceId) || EVIDENCIAS[0];
  criteriaState = {};
  
  // Default all criteria to 'Excelente'
  currentEvidence.criterios.forEach(c => {
    criteriaState[c.id] = 'Excelente';
  });

  // Render criteria
  criteriaContainer.innerHTML = '';
  currentEvidence.criterios.forEach(crit => {
    const row = document.createElement('div');
    row.className = 'criterion-row';

    const title = document.createElement('div');
    title.className = 'criterion-name';
    title.innerText = crit.nombre + ' (' + crit.peso + '%)';
    row.appendChild(title);

    const levelsGroup = document.createElement('div');
    levelsGroup.className = 'levels-group';

    const levels = ['Excelente', 'Bueno', 'Regular', 'Insuficiente'];
    levels.forEach(lvl => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-btn ' + (criteriaState[crit.id] === lvl ? 'active' : '');
      btn.innerText = lvl;
      btn.addEventListener('click', () => {
        criteriaState[crit.id] = lvl;
        levelsGroup.querySelectorAll('.level-btn').forEach(b => {
          b.className = 'level-btn';
        });
        let activeClass = 'active';
        if (lvl === 'Regular') activeClass = 'active-regular';
        if (lvl === 'Insuficiente') activeClass = 'active-insuficiente';
        btn.classList.add(activeClass);
        updateFeedback();
      });
      levelsGroup.appendChild(btn);
    });

    row.appendChild(levelsGroup);
    criteriaContainer.appendChild(row);
  });

  // Render strengths checkboxes
  strengthsContainer.innerHTML = '';
  selectedStrengths = [currentEvidence.fortalezasComunes[0] || ''];
  currentEvidence.fortalezasComunes.forEach((str, idx) => {
    const item = document.createElement('label');
    item.className = 'checkbox-item';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.value = str;
    chk.checked = idx === 0;
    chk.addEventListener('change', () => {
      selectedStrengths = Array.from(strengthsContainer.querySelectorAll('input:checked')).map(c => c.value);
      updateFeedback();
    });
    item.appendChild(chk);
    const span = document.createElement('span');
    span.innerText = str;
    item.appendChild(span);
    strengthsContainer.appendChild(item);
  });

  // Render improvements checkboxes
  improvementsContainer.innerHTML = '';
  selectedImprovements = [];
  currentEvidence.mejorasComunes.forEach((imp, idx) => {
    const item = document.createElement('label');
    item.className = 'checkbox-item';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.value = imp;
    chk.checked = false;
    chk.addEventListener('change', () => {
      selectedImprovements = Array.from(improvementsContainer.querySelectorAll('input:checked')).map(c => c.value);
      updateFeedback();
    });
    item.appendChild(chk);
    const span = document.createElement('span');
    span.innerText = imp;
    item.appendChild(span);
    improvementsContainer.appendChild(item);
  });

  updateFeedback();
}

function calculateScore() {
  let totalScore = 0;
  currentEvidence.criterios.forEach(crit => {
    const selectedLevelName = criteriaState[crit.id] || 'Excelente';
    const levelObj = crit.niveles.find(n => n.nivel === selectedLevelName) || crit.niveles[0];
    totalScore += (levelObj.puntos * crit.peso) / 100;
  });
  return Math.round(totalScore);
}

function updateFeedback() {
  const learner = learnerInput.value.trim() || 'Aprendiz';
  const score = calculateScore();
  const isApproved = score >= 70;
  const status = isApproved ? 'A' : 'D';

  scoreBadge.innerText = status + ' (' + score + ' pts)';
  scoreBadge.style.background = isApproved ? '#277800' : '#dc2626';

  let text = 'Estimado(a) aprendiz ' + learner + ', cordial saludo desde la virtualidad institucional SENA.\\n\\n';
  
  if (isApproved) {
    text += 'Agradezco y reconozco su notable esfuerzo, disciplina y compromiso demostrado en el desarrollo y entrega oportuna de la evidencia: "' + currentEvidence.codigo + ' - ' + currentEvidence.titulo + '".\\n\\n';
  } else {
    text += 'Agradezco su dedicación al presentar la evidencia: "' + currentEvidence.codigo + ' - ' + currentEvidence.titulo + '". El camino emprendedor es un proceso continuo de retroalimentación y aprendizaje.\\n\\n';
  }

  text += '--------------------------------------------------\\n';
  text += 'JUICIO DE EVALUACIÓN: ' + (isApproved ? 'A - APROBADO' : 'D - NO APROBADO / DEFICIENTE') + '\\n';
  text += 'CALIFICACIÓN CUANTITATIVA: ' + score + ' / 100 puntos\\n';
  text += 'RESULTADO DE APRENDIZAJE: ' + currentEvidence.rap + '\\n';
  text += '--------------------------------------------------\\n\\n';

  text += 'VALORACIÓN DETALLADA POR CRITERIOS DE RÚBRICA:\\n';
  currentEvidence.criterios.forEach(crit => {
    const lvlName = criteriaState[crit.id] || 'Excelente';
    const lvlObj = crit.niveles.find(n => n.nivel === lvlName) || crit.niveles[0];
    text += '• ' + crit.nombre + ': [' + lvlName.toUpperCase() + ' - ' + lvlObj.puntos + ' pts]\\n';
    text += '  ' + lvlObj.observacionSugerida + '\\n';
  });
  text += '\\n';

  if (selectedStrengths.length > 0) {
    text += 'ASPECTOS DESTACADOS Y FORTALEZAS IDENTIFICADAS:\\n';
    selectedStrengths.forEach(s => {
      text += '✓ ' + s + '\\n';
    });
    text += '\\n';
  }

  if (selectedImprovements.length > 0) {
    text += 'OPORTUNIDADES DE MEJORA Y RECOMENDACIONES PEDAGÓGICAS (GUÍA AVA):\\n';
    selectedImprovements.forEach(m => {
      text += '→ ' + m + '\\n';
    });
    text += '\\n';
  }

  const custom = customNotesInput.value.trim();
  if (custom) {
    text += 'OBSERVACIONES ESPECÍFICAS DEL INSTRUCTOR:\\n' + custom + '\\n\\n';
  }

  if (!isApproved) {
    text += 'INDICACIONES DE MEJORAMIENTO Y REENVÍO:\\n';
    text += currentEvidence.instruccionesReenvio + '\\n\\n';
  }

  text += '--------------------------------------------------\\n';
  if (isApproved) {
    text += 'Le motivo a continuar con este mismo entusiasmo y dedicación en las siguientes evidencias de nuestra Cátedra Virtual de Pensamiento Empresarial. Quedo atento(a) a través del Foro de Dudas e Inquietudes y la mensajería institucional.\\n\\n';
  } else {
    text += 'Ánimo, el error es parte fundamental del aprendizaje emprendedor. Le invito a realizar los ajustes solicitados y reenviar su evidencia por la plataforma. Cuenta con todo mi apoyo pedagógico.\\n\\n';
  }

  text += 'Atentamente,\\n\\nInstructor(a) Virtual SENA\\nÁrea de Gestión Administrativa\\nCátedra Virtual de Pensamiento Empresarial';

  feedbackPreview.value = text;
}

function copyFeedback() {
  feedbackPreview.select();
  navigator.clipboard.writeText(feedbackPreview.value).then(() => {
    showStatus('¡Copiado con éxito al portapapeles! Listo para pegar en Zajuna.', true);
  }).catch(() => {
    document.execCommand('copy');
    showStatus('¡Copiado al portapapeles!', true);
  });
}

function injectIntoLMS() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) {
      showStatus('No se detectó pestaña activa.', false);
      return;
    }
    const textToInject = feedbackPreview.value;
    const scoreToInject = calculateScore();

    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'INJECT_FEEDBACK',
      feedbackText: textToInject,
      score: scoreToInject,
      isApproved: scoreToInject >= 70
    }, (response) => {
      if (chrome.runtime.lastError) {
        // Fallback: execute scripting directly
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (text) => {
            const textareas = document.querySelectorAll('textarea, div[contenteditable="true"], iframe');
            let filled = false;
            textareas.forEach(el => {
              if (el.tagName === 'TEXTAREA') {
                el.value = text;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                filled = true;
              } else if (el.getAttribute('contenteditable') === 'true') {
                el.innerText = text;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                filled = true;
              }
            });
            return filled;
          },
          args: [textToInject]
        }, (res) => {
          if (res && res[0] && res[0].result) {
            showStatus('¡Retroalimentación inyectada exitosamente en el LMS!', true);
          } else {
            // Copy to clipboard anyway
            copyFeedback();
            showStatus('Copiado al portapapeles (pega con Ctrl+V en Zajuna)', true);
          }
        });
      } else if (response && response.success) {
        showStatus('¡Retroalimentación pegada en el formulario de calificación!', true);
      } else {
        copyFeedback();
      }
    });
  });
}

function showStatus(msg, isSuccess) {
  statusMsg.innerText = msg;
  statusMsg.className = 'status-msg ' + (isSuccess ? 'status-success' : 'status-error');
  setTimeout(() => {
    statusMsg.innerText = '';
  }, 4000);
}

document.addEventListener('DOMContentLoaded', init);
`;
}

export function getContentJS(): string {
  return `
// Content script for Zajuna / Territorium / SENA LMS
(function() {
  console.log('[SENA Evaluador AVA] Content script cargado.');

  // Create floating quick paste helper button
  const floatingBtn = document.createElement('div');
  floatingBtn.id = 'sena-ava-quick-btn';
  floatingBtn.innerHTML = '<span>⚡ SENA AVA</span>';
  floatingBtn.style.cssText = \`
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: #39A900;
    color: white;
    padding: 10px 16px;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    z-index: 999999;
    transition: transform 0.2s, background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  \`;

  floatingBtn.addEventListener('mouseenter', () => {
    floatingBtn.style.transform = 'scale(1.05)';
    floatingBtn.style.backgroundColor = '#2e8600';
  });
  floatingBtn.addEventListener('mouseleave', () => {
    floatingBtn.style.transform = 'scale(1)';
    floatingBtn.style.backgroundColor = '#39A900';
  });

  floatingBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.includes('SENA')) {
        alert('Por favor abra la extensión de SENA Evaluador AVA y copie la retroalimentación primero.');
        return;
      }
      injectTextIntoActiveField(text);
    } catch (e) {
      alert('Haga clic derecho y elija Pegar (Ctrl+V) en el cuadro de texto de retroalimentación.');
    }
  });

  document.body.appendChild(floatingBtn);

  // Message listener from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'INJECT_FEEDBACK') {
      const result = injectTextIntoActiveField(request.feedbackText, request.score, request.isApproved);
      sendResponse({ success: result });
    }
  });

  function injectTextIntoActiveField(text, score, isApproved) {
    // Look for comments textarea in LMS
    const selectors = [
      'textarea[name*="comment"]',
      'textarea[name*="retro"]',
      'textarea[name*="feedback"]',
      'textarea[id*="retro"]',
      'textarea[id*="comment"]',
      'div[role="textbox"]',
      'div.ql-editor',
      'div.note-editable',
      'textarea'
    ];

    let target = document.activeElement;
    if (!target || (target.tagName !== 'TEXTAREA' && target.getAttribute('contenteditable') !== 'true')) {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          target = el;
          break;
        }
      }
    }

    if (target) {
      if (target.tagName === 'TEXTAREA') {
        target.value = text;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        target.innerText = text;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Also try to set score or radio button if present
      if (score !== undefined) {
        const scoreInput = document.querySelector('input[type="number"], input[name*="nota"], input[name*="calificacion"], input[name*="score"]');
        if (scoreInput) {
          scoreInput.value = score;
          scoreInput.dispatchEvent(new Event('input', { bubbles: true }));
          scoreInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Check if there is an A / D radio or select
        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(r => {
          const val = (r.value || '').toUpperCase();
          const label = (r.labels && r.labels[0] ? r.labels[0].innerText : '').toUpperCase();
          if (isApproved && (val === 'A' || label.includes('APROBADO') || val.includes('APROB') || val === '1')) {
            r.checked = true;
            r.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (!isApproved && (val === 'D' || label.includes('DEFICIENTE') || val.includes('NO APROBADO') || val === '0')) {
            r.checked = true;
            r.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus();
      return true;
    }
    return false;
  }
})();
`;
}

export function getContentCSS(): string {
  return `
#sena-ava-quick-btn:active {
  transform: scale(0.95) !important;
}
`;
}

export function getReadmeTXT(): string {
  return `========================================================================
 GUÍA DE INSTALACIÓN: EXTENSIÓN DE GOOGLE CHROME
 SENA EVALUADOR AVA PRO - CÁTEDRA DE PENSAMIENTO EMPRESARIAL
========================================================================

Esta extensión permite a los Instructores Virtuales SENA del área de
Gestión Administrativa calificar directamente en Zajuna / Territorium
con un solo clic y retroalimentar a los aprendices con nombre propio.

------------------------------------------------------------------------
 PASOS PARA INSTALAR EN GOOGLE CHROME:
------------------------------------------------------------------------
1. Descomprima este archivo ZIP en una carpeta de su computador
   (por ejemplo: "C:\\SENA\\Extension-Evaluador-AVA").

2. Abra su navegador Google Chrome y en la barra de direcciones escriba:
   chrome://extensions/  (y presione Enter).

3. En la esquina superior DERECHA de la pantalla, active la casilla:
   [Modo de desarrollador] (Developer mode).

4. En la esquina superior IZQUIERDA, haga clic en el botón:
   [Cargar descomprimida] (Load unpacked).

5. Seleccione la carpeta donde descomprimió los archivos y haga clic
   en "Seleccionar carpeta".

¡Listo! Aparecerá el ícono del SENA Evaluador AVA en su barra de extensiones.

------------------------------------------------------------------------
 CÓMO USAR LA EXTENSIÓN:
------------------------------------------------------------------------
1. Fije la extensión en la barra de Chrome haciendo clic en el ícono de la
   pieza de rompecabezas y luego en la chincheta (pin) junto a "SENA Evaluador AVA".
2. Ingrese a la plataforma Zajuna / Territorium del SENA.
3. Abra la entrega de cualquier aprendiz.
4. Haga clic en el ícono de la extensión:
   - Digite el nombre del aprendiz (o se detectará automáticamente).
   - Seleccione la evidencia (AA1-EV02, AA2-EV01, AA2-EV02 o AA2-EV03).
   - Ajuste los criterios de la rúbrica (Excelente, Bueno, Regular, Insuficiente).
   - Haga clic en "📋 Copiar Retroalimentación" o "⚡ Inyectar en Zajuna".
5. ¡La retroalimentación completa con nombre propio, reconocimiento de esfuerzo
   y sugerencias de la guía AVA se pegará instantáneamente!

Centro de Gestión Administrativa - Formación Virtual SENA.
========================================================================`;
}

// Generates an in-memory 128x128 green SENA SVG/PNG canvas data for extension icon
function createSenaIconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="24" fill="#39A900"/>
  <circle cx="64" cy="40" r="18" fill="#FFFFFF"/>
  <path d="M64 64 L34 104 L50 104 L64 82 L78 104 L94 104 Z" fill="#FFFFFF"/>
</svg>`;
}

export async function generateExtensionZip(): Promise<Blob> {
  const zip = new JSZip();

  zip.file('manifest.json', getManifestJSON());
  zip.file('popup.html', getPopupHTML());
  zip.file('popup.css', getPopupCSS());
  zip.file('popup.js', getPopupJS());
  zip.file('content.js', getContentJS());
  zip.file('content.css', getContentCSS());
  zip.file('README.txt', getReadmeTXT());
  zip.file('icon.svg', createSenaIconSvg());

  // Also generate 16, 48, 128 icons via canvas if in browser
  const iconBlob = await generateIconBlob();
  if (iconBlob) {
    zip.file('icon16.png', iconBlob);
    zip.file('icon48.png', iconBlob);
    zip.file('icon128.png', iconBlob);
  }

  return await zip.generateAsync({ type: 'blob' });
}

async function generateIconBlob(): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  ctx.fillStyle = '#39A900';
  ctx.beginPath();
  ctx.roundRect(0, 0, 128, 128, 24);
  ctx.fill();

  // White head
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(64, 40, 18, 0, Math.PI * 2);
  ctx.fill();

  // White body / triangles
  ctx.beginPath();
  ctx.moveTo(64, 64);
  ctx.lineTo(34, 104);
  ctx.lineTo(50, 104);
  ctx.lineTo(64, 82);
  ctx.lineTo(78, 104);
  ctx.lineTo(94, 104);
  ctx.closePath();
  ctx.fill();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
