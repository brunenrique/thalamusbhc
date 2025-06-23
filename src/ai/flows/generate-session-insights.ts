'use server';

/**
 * @fileOverview Generates session insights from session notes using AI.
 *
 * - generateSessionInsights - A function that handles the generation of session insights.
 * - GenerateSessionInsightsInput - The input type for the generateSessionInsights function.
 * - GenerateSessionInsightsOutput - The return type for the generateSessionInsights function.
 */

import { ai } from '@/ai/genkit';
import { trackFlow } from '@/ai/logging';
import { getPrompt } from '@/ai/prompts';
import { z } from 'genkit';

export const GenerateSessionInsightsInputSchema = z.object({
  sessionNotes: z.string().describe('The session notes to analyze.'),
  patientHistorySummary: z
    .string()
    .optional()
    .describe('A brief summary of the patient relevant history and previous inventory results.'),
});
export type GenerateSessionInsightsInput = z.infer<typeof GenerateSessionInsightsInputSchema>;

export const GenerateSessionInsightsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('Keywords identified in the session notes.'),
  themes: z.array(z.string()).describe('Themes identified in the session notes.'),
  symptomEvolution: z.string().describe('Description of symptom evolution based on the notes.'),
  suggestiveInsights: z
    .string()
    .describe('Suggestive insights to improve understanding of patient progress.'),
  therapeuticMilestones: z
    .array(z.string())
    .optional()
    .describe('Identified significant therapeutic milestones or breakthroughs in the session.'),
  inventoryComparisonInsights: z
    .string()
    .optional()
    .describe(
      'Analysis comparing current session notes with past inventory responses and history to show evolution.'
    ),
  potentialRiskAlerts: z
    .array(z.string())
    .optional()
    .describe(
      'Subtle alerts based on language patterns or metric decline indicating potential risks (e.g., increased anxiety, depressive thoughts).'
    ),
});
export type GenerateSessionInsightsOutput = z.infer<typeof GenerateSessionInsightsOutputSchema>;

import type { Result } from '@/ai/types';

export async function generateSessionInsights(
  input: GenerateSessionInsightsInput
): Promise<Result<GenerateSessionInsightsOutput>> {
  try {
    const data = await trackFlow('generateSessionInsightsFlow', generateSessionInsightsFlow, input);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Erro ao gerar resposta' };
  }
}

const prompt = ai.definePrompt({
  name: 'generateSessionInsightsPrompt',
  input: { schema: GenerateSessionInsightsInputSchema },
  output: { schema: GenerateSessionInsightsOutputSchema },
  prompt: getPrompt('generateSessionInsights'),
});

const generateSessionInsightsFlow = ai.defineFlow(
  {
    name: 'generateSessionInsightsFlow',
    inputSchema: GenerateSessionInsightsInputSchema,
    outputSchema: GenerateSessionInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
