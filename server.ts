import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Endpoint to generate or enhance SENA pedagogical feedback
app.post('/api/enhance-feedback', async (req, res) => {
  try {
    const {
      studentName,
      evidenceId,
      evidenceTitle,
      score,
      status, // 'A' | 'D'
      criteriaFeedback,
      strengths,
      improvements,
      customNotes,
      instructorName,
    } = req.body;

    if (!aiClient) {
      return res.status(200).json({
        fallback: true,
        message: 'No se detectó GEMINI_API_KEY en variables de entorno. Utilizando motor pedagógico determinístico integrado.',
      });
    }

    const prompt = `
Actúa como un Instructor Virtual SENA experto en Gestión Administrativa y Pedagogía Institucional AVA.
Redacta una retroalimentación pedagógica formal, motivadora y constructiva para un aprendiz de la formación virtual:
"CÁTEDRA VIRTUAL DE PENSAMIENTO EMPRESARIAL - MÓDULO I: MENTALIDAD EMPRESARIAL" (40 horas).

Datos de la evaluación:
- Nombre del Aprendiz: ${studentName || 'Aprendiz'}
- Evidencia: ${evidenceId} - ${evidenceTitle}
- Calificación: ${score}/100 puntos (${status === 'A' ? 'A - APROBADO' : 'D - NO APROBADO / DEFICIENTE'})
- Criterios evaluados y observaciones: ${JSON.stringify(criteriaFeedback || {})}
- Fortalezas identificadas: ${strengths || 'Esfuerzo y dedicación en el desarrollo'}
- Oportunidades de mejora sugeridas: ${improvements || 'Profundizar en la aplicación de los conceptos de la guía'}
- Notas adicionales del instructor: ${customNotes || 'Ninguna'}
- Nombre del Instructor: ${instructorName || 'Instructor(a) Virtual SENA - Área de Gestión Administrativa'}

Estructura OBLIGATORIA según la Guía de Orientación AVA del SENA:
1. Saludo formal y personalizado con el nombre propio del aprendiz.
2. Reconocimiento explícito de su esfuerzo, compromiso y entrega de la evidencia.
3. Veredicto pedagógico claro (Juicio de evaluación: Aprobado [A] o No Aprobado [D]) con su puntaje.
4. Análisis cualitativo de la evidencia:
   - Aspectos destacados / Fortalezas técnicas y conceptuales.
   - Oportunidades de mejora concretas y aplicables según la guía de aprendizaje.
   ${status === 'D' ? '5. Indicaciones claras para el reenvío o ajuste de la evidencia en la plataforma para alcanzar el resultado de aprendizaje.' : '5. Motivación a continuar con el mismo entusiasmo en las siguientes actividades de la Cátedra.'}
6. Despedida formal, invitación a los canales de atención (Foro de Dudas e Inquietudes, Mensajería interna) y firma del Instructor(a).

Devuelve únicamente el texto de la retroalimentación redactado de manera impecable, cálida, profesional y con la identidad institucional del SENA.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const enhancedText = response.text || '';
    return res.json({ enhancedText });
  } catch (error) {
    console.error('Error enhancing feedback with Gemini:', error);
    return res.status(500).json({
      error: 'Error al contactar el servicio de IA.',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Servidor SENA Evaluador AVA ejecutándose en http://localhost:${port}`);
  });
}

startServer();
