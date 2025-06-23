
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
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
    console.error('Erro na API de supervisão:', e);
    const errorMessage = e instanceof Error ? e.message : 'Falha ao processar a solicitação de supervisão.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
