/**
 * @fileOverview An AI agent for processing session notes and identifying key themes and insights.
 *
 * - analyzeSessionNotes - A function that handles the session notes analysis process.
 * - SessionInsightsInput - The input type for the analyzeSessionNotes function.
 * - SessionInsightsOutput - The return type for the analyzeSessionNotes function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SessionInsightsInputSchema = z.object({
  sessionNotes: z
    .string()
    .describe('The session notes to analyze.'),
});
export type SessionInsightsInput = z.infer<typeof SessionInsightsInputSchema>;

const SessionInsightsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('The key words identified in the session notes.'),
  themes: z.array(z.string()).describe('The themes identified in the session notes.'),
  suggestedInsights: z.string().describe('Suggestive insights based on the session notes.'),
  symptomEvolutionChartDescription: z
    .string()
    .describe('A description of a chart describing symptom evolution.'),
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
  prompt: `You are an AI assistant designed to help psychologists analyze their session notes.

  You will receive session notes as input. You must identify the key words, themes and suggest insights based on the notes. You will make a determination as to how the patient's symptoms are evolving and describe the evolution as a chart. 

  Session Notes: {{{sessionNotes}}}`,
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
