/**
 * @openapi
 * /api/ai/session-note-template:
 *   post:
 *     summary: Cria modelo de nota de sessão via IA.
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
 *         description: Modelo gerado com sucesso.
 *       '400':
 *         description: Dados de entrada inválidos.
 *       '500':
 *         description: Falha ao gerar modelo.
 */
import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import {
  generateSessionNoteTemplate,
  GenerateSessionNoteTemplateInputSchema,
} from "@/ai/flows/generate-session-note-template";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = GenerateSessionNoteTemplateInputSchema.parse(body);
    const result = await generateSessionNoteTemplate(input);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos" },
        { status: 400 },
      );
    }
    Sentry.captureException(e);
    logger.error({ action: 'generate_session_note_template_error', meta: { error: e } });
    return NextResponse.json(
      { error: "Failed to generate session note template" },
      { status: 500 },
    );
  }
}
