'use server';
/**
 * @fileOverview An AI agent for generating drafts of clinical reports from session notes.
 *
 * - generateReportDraft - A function that handles the report draft generation process.
 * - GenerateReportDraftInput - The input type for the generateReportDraft function.
 * - GenerateReportDraftOutput - The return type for the generateReportDraft function.
 */

import { ai } from '@/ai/genkit';
import { trackFlow } from '@/ai/logging';
import { z } from 'genkit';
import { getPrompt } from '@/ai/prompts';

export const GenerateReportDraftInputSchema = z.object({
  sessionNotes: z.string().describe('The session notes to base the report on.'),
  patientName: z.string().describe('The name of the patient.'),
  reportType: z
    .enum(['progress_report', 'referral_letter', 'session_summary'])
    .describe('The type of report to generate.'),
  therapistName: z.string().optional().describe('The name of the therapist (e.g., Dr. Silva).'),
});
export type GenerateReportDraftInput = z.infer<typeof GenerateReportDraftInputSchema>;

export const GenerateReportDraftOutputSchema = z.object({
  draftContent: z.string().describe('The generated draft content of the report.'),
});
export type GenerateReportDraftOutput = z.infer<typeof GenerateReportDraftOutputSchema>;

import type { Result } from '@/ai/types';

export async function generateReportDraft(
  input: GenerateReportDraftInput
): Promise<Result<GenerateReportDraftOutput>> {
  try {
    const data = await trackFlow('generateReportDraftFlow', generateReportDraftFlow, input);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Erro ao gerar resposta' };
  }
}

const prompt = ai.definePrompt({
  name: 'generateReportDraftPrompt',
  input: { schema: GenerateReportDraftInputSchema },
  output: { schema: GenerateReportDraftOutputSchema },
  prompt: getPrompt('generateReportDraft'),
});

const generateReportDraftFlow = ai.defineFlow(
  {
    name: 'generateReportDraftFlow',
    inputSchema: GenerateReportDraftInputSchema,
    outputSchema: GenerateReportDraftOutputSchema,
  },
  async (input: GenerateReportDraftInput) => {
    const { output } = await prompt(input);
    return output!;
  }
);
