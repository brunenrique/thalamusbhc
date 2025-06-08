'use server';

/**
 * @fileOverview Generates session insights from session notes using AI.
 *
 * - generateSessionInsights - A function that handles the generation of session insights.
 * - GenerateSessionInsightsInput - The input type for the generateSessionInsights function.
 * - GenerateSessionInsightsOutput - The return type for the generateSessionInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSessionInsightsInputSchema = z.object({
  sessionNotes: z
    .string()
    .describe('The session notes to analyze.'),
});
export type GenerateSessionInsightsInput = z.infer<typeof GenerateSessionInsightsInputSchema>;

const GenerateSessionInsightsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('Keywords identified in the session notes.'),
  themes: z.array(z.string()).describe('Themes identified in the session notes.'),
  symptomEvolution: z.string().describe('Description of symptom evolution based on the notes.'),
  suggestiveInsights: z.string().describe('Suggestive insights to improve understanding of patient progress.'),
});
export type GenerateSessionInsightsOutput = z.infer<typeof GenerateSessionInsightsOutputSchema>;

export async function generateSessionInsights(input: GenerateSessionInsightsInput): Promise<GenerateSessionInsightsOutput> {
  return generateSessionInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSessionInsightsPrompt',
  input: {schema: GenerateSessionInsightsInputSchema},
  output: {schema: GenerateSessionInsightsOutputSchema},
  prompt: `You are an AI assistant for psychologists. Analyze the following session notes to identify key themes, symptom evolution, and provide suggestive insights.

Session Notes:
{{{sessionNotes}}}

Output should be in JSON format. Return keywords, themes, symptomEvolution, and suggestiveInsights. `,
});

const generateSessionInsightsFlow = ai.defineFlow(
  {
    name: 'generateSessionInsightsFlow',
    inputSchema: GenerateSessionInsightsInputSchema,
    outputSchema: GenerateSessionInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
