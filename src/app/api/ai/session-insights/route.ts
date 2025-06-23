import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
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
    console.error("Error generating session insights:", e);
    return NextResponse.json(
      { error: "Failed to generate session insights" },
      { status: 500 },
    );
  }
}
