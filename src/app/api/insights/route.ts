/**
 * @openapi
 * /api/insights:
 *   post:
 *     summary: Gera insights de uma sessão terapêutica via IA.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionNotes:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Insights gerados.
 *       '400':
 *         description: Dados de entrada inválidos.
 *       '401':
 *         description: Não autenticado.
 *       '500':
 *         description: Falha ao gerar insights.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import {
  generateSessionInsights,
  GenerateSessionInsightsInputSchema,
} from '@/ai/flows/generate-session-insights';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const decoded = await adminAuth().verifyIdToken(token);
    const body = await request.json();
    const input = GenerateSessionInsightsInputSchema.parse(body);
    const result = await generateSessionInsights(input, { userId: decoded.uid });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'Dados de entrada inválidos' }, { status: 400 });
    }
    if (e instanceof Error && e.message.includes('auth')) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    Sentry.captureException(e);
    logger.error({ action: 'generate_insights_error', meta: { error: e } });
    return NextResponse.json({ error: 'Failed to generate session insights' }, { status: 500 });
  }
}
