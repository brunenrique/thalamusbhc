'use server'

/**
 * @fileoverview Gera insights resumidos de uma sessão de psicoterapia.
 *
 * Pseudocódigo:
 * 1. Definir schemas de entrada e saída.
 * 2. Criar prompt no Genkit com placeholders.
 * 3. Definir flow que executa o prompt.
 * 4. Função geraSessionInsights executa o flow com trackFlow.
 */

import { ai } from '@/ai/genkit';
import { trackFlow } from '@/ai/logging';
import { z } from 'genkit';
import type { Result } from '@/ai/types';

export const SessionInsightsInputSchema = z.object({
  summary: z.string().describe('Resumo textual da sessão'),
});
export type SessionInsightsInput = z.infer<typeof SessionInsightsInputSchema>;

export const SessionInsightsOutputSchema = z.object({
  feelings: z.array(z.string()).describe('Sentimentos identificados'),
  topics: z.array(z.string()).describe('Tópicos discutidos'),
  suggestions: z.array(z.string()).describe('Sugestões de próximas ações'),
});
export type SessionInsightsOutput = z.infer<typeof SessionInsightsOutputSchema>;

export async function generateSessionInsights(
  input: SessionInsightsInput,
): Promise<Result<SessionInsightsOutput>> {
  try {
    const data = await trackFlow(
      'sessionInsightsFlow',
      sessionInsightsFlow,
      input,
    );
    return { success: true, data };
  } catch {
    return { success: false, error: 'Erro ao gerar insights' };
  }
}

const prompt = ai.definePrompt({
  name: 'sessionInsightsPrompt',
  input: { schema: SessionInsightsInputSchema },
  output: { schema: SessionInsightsOutputSchema },
  prompt: `Analise o resumo a seguir e responda em JSON com listas de feelings, topics e suggestions.\nResumo:\n{{{summary}}}`,
});

const sessionInsightsFlow = ai.defineFlow(
  {
    name: 'sessionInsightsFlow',
    inputSchema: SessionInsightsInputSchema,
    outputSchema: SessionInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
