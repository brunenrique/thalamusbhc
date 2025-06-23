/**
 * @openapi
 * /api/ai/session-insights:
 *   post:
 *     summary: Gera insights de uma sessão terapêutica via IA.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transcript:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Insights gerados.
 *       '400':
 *         description: Dados de entrada inválidos.
 *       '500':
 *         description: Falha ao gerar insights.
 */
import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import {
  generateSessionInsights,
  GenerateSessionInsightsInputSchema,
} from "@/ai/flows/generate-session-insights";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = GenerateSessionInsightsInputSchema.parse(body);
    const result = await generateSessionInsights(input);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos" },
        { status: 400 },
      );
    }
    Sentry.captureException(e);
    logger.error({ action: 'generate_session_insights_error', meta: { error: e } });
    return NextResponse.json(
      { error: "Failed to generate session insights" },
      { status: 500 },
    );
  }
}
