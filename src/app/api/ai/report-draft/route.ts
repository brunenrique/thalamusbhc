/**
 * @openapi
 * /api/ai/report-draft:
 *   post:
 *     summary: Gera rascunho de relatório terapêutico via IA.
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
 *         description: Rascunho gerado com sucesso.
 *       '400':
 *         description: Dados de entrada inválidos.
 *       '500':
 *         description: Erro ao gerar rascunho de relatório.
 */
import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
import {
  generateReportDraft,
  GenerateReportDraftInputSchema,
} from "@/ai/flows/generate-report-draft-flow";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = GenerateReportDraftInputSchema.parse(body);
    const result = await generateReportDraft(input);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos" },
        { status: 400 },
      );
    }
    Sentry.captureException(e);
    console.error("Error generating report draft:", e);
    return NextResponse.json(
      { error: "Failed to generate report draft" },
      { status: 500 },
    );
  }
}
