'use server';
/**
 * @fileOverview An AI agent for generating session note templates.
 *
 * - generateSessionNoteTemplate - A function that handles the session note template generation process.
 * - GenerateSessionNoteTemplateInput - The input type for the generateSessionNoteTemplate function.
 * - GenerateSessionNoteTemplateOutput - The return type for the generateSessionNoteTemplate function.
 */

import { ai } from '@/ai/genkit';
import { trackFlow } from '@/ai/logging';
import { getPrompt } from '@/ai/prompts';
import { z } from 'genkit';

export const GenerateSessionNoteTemplateInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  sessionSummary: z.string().describe('A summary of the therapy session.'),
  therapistInstructions: z
    .string()
    .optional()
    .describe('Optional instructions for the AI to tailor the template.'),
});
export type GenerateSessionNoteTemplateInput = z.infer<
  typeof GenerateSessionNoteTemplateInputSchema
>;

export const GenerateSessionNoteTemplateOutputSchema = z.object({
  template: z.string().describe('The generated session note template.'),
});
export type GenerateSessionNoteTemplateOutput = z.infer<
  typeof GenerateSessionNoteTemplateOutputSchema
>;

import type { Result } from '@/ai/types';

export async function generateSessionNoteTemplate(
  input: GenerateSessionNoteTemplateInput
): Promise<Result<GenerateSessionNoteTemplateOutput>> {
  try {
    const data = await trackFlow(
      'generateSessionNoteTemplateFlow',
      generateSessionNoteTemplateFlow,
      input
    );
    return { success: true, data };
  } catch (_err) {
    return { success: false, error: 'Erro ao gerar resposta' };
  }
}

const prompt = ai.definePrompt({
  name: 'generateSessionNoteTemplatePrompt',
  input: { schema: GenerateSessionNoteTemplateInputSchema },
  output: { schema: GenerateSessionNoteTemplateOutputSchema },
  prompt: getPrompt('generateSessionNoteTemplate'),
});

const generateSessionNoteTemplateFlow = ai.defineFlow(
  {
    name: 'generateSessionNoteTemplateFlow',
    inputSchema: GenerateSessionNoteTemplateInputSchema,
    outputSchema: GenerateSessionNoteTemplateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
