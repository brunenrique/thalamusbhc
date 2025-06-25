/**
 * @fileOverview An AI agent for processing session notes and identifying key themes and insights.
 *
 * - analyzeSessionNotes - A function that handles the session notes analysis process.
 * - SessionInsightsInput - The input type for the analyzeSessionNotes function.
 * - SessionInsightsOutput - The return type for the analyzeSessionNotes function.
 */

'use server';

import {ai} from '@/lib/genkit';
import {z} from 'genkit';

const SessionInsightsInputSchema = z.object({
  sessionNotes: z
    .string()
    .describe('As anotações da sessão para analisar.'),
});
export type SessionInsightsInput = z.infer<typeof SessionInsightsInputSchema>;

const SessionInsightsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('As palavras-chave identificadas nas anotações da sessão.'),
  themes: z.array(z.string()).describe('Os temas identificados nas anotações da sessão.'),
  suggestedInsights: z.string().describe('Insights sugestivos baseados nas anotações da sessão.'),
  symptomEvolutionChartDescription: z
    .string()
    .describe('Uma descrição de um gráfico descrevendo a evolução dos sintomas.'),
});
export type SessionInsightsOutput = z.infer<typeof SessionInsightsOutputSchema>;

export async function analyzeSessionNotes(
  input: SessionInsightsInput
): Promise<SessionInsightsOutput> {
  return analyzeSessionNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sessionInsightsPrompt',
  input: {schema: SessionInsightsInputSchema},
  output: {schema: SessionInsightsOutputSchema},
  prompt: `Você é um assistente de IA projetado para ajudar psicólogos a analisar suas anotações de sessão.
  
  Você receberá anotações de sessão como entrada. Você deve identificar as palavras-chave, temas e sugerir insights com base nas anotações. Você fará uma determinação sobre como os sintomas do paciente estão evoluindo e descreverá a evolução como um gráfico. 

  Anotações da Sessão: {{{sessionNotes}}}`,
});

const analyzeSessionNotesFlow = ai.defineFlow(
  {
    name: 'analyzeSessionNotesFlow',
    inputSchema: SessionInsightsInputSchema,
    outputSchema: SessionInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
