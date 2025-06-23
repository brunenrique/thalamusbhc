
/**
 * @openapi
 * /api/supervisao:
 *   post:
 *     summary: Gera orientações de supervisão clínica via IA.
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
 *         description: Orientações geradas com sucesso.
 *       '400':
 *         description: Dados de entrada inválidos.
 *       '500':
 *         description: Erro interno ao gerar supervisão.
 */
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import { ZodError } from 'zod';
import {
  getClinicalSupervision,
  ClinicalSupervisionInputSchema,
} from '@/ai/flows/clinical-supervision-flow';
// import { auth } from '@/lib/firebase'; // Auth check would go here in a real setup

export async function POST(req: Request) {
  // Placeholder for actual authentication check
  // if (!auth.currentUser) {
  //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  // }

  try {
    const body = await req.json();
    const input = ClinicalSupervisionInputSchema.parse(body);

    const result = await getClinicalSupervision(input);

    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados de entrada inválidos.', details: e.errors },
        { status: 400 }
      );
    }
    Sentry.captureException(e);
    logger.error({ action: 'supervisao_api_error', meta: { error: e } });
    const errorMessage = e instanceof Error ? e.message : 'Falha ao processar a solicitação de supervisão.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
