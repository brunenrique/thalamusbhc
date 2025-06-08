'use server';
/**
 * @fileOverview An AI agent for generating session note templates.
 *
 * - generateSessionNoteTemplate - A function that handles the session note template generation process.
 * - GenerateSessionNoteTemplateInput - The input type for the generateSessionNoteTemplate function.
 * - GenerateSessionNoteTemplateOutput - The return type for the generateSessionNoteTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSessionNoteTemplateInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  sessionSummary: z.string().describe('A summary of the therapy session.'),
  therapistInstructions: z.string().optional().describe('Optional instructions for the AI to tailor the template.'),
});
export type GenerateSessionNoteTemplateInput = z.infer<typeof GenerateSessionNoteTemplateInputSchema>;

const GenerateSessionNoteTemplateOutputSchema = z.object({
  template: z.string().describe('The generated session note template.'),
});
export type GenerateSessionNoteTemplateOutput = z.infer<typeof GenerateSessionNoteTemplateOutputSchema>;

export async function generateSessionNoteTemplate(input: GenerateSessionNoteTemplateInput): Promise<GenerateSessionNoteTemplateOutput> {
  return generateSessionNoteTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSessionNoteTemplatePrompt',
  input: {schema: GenerateSessionNoteTemplateInputSchema},
  output: {schema: GenerateSessionNoteTemplateOutputSchema},
  prompt: `You are an AI assistant that generates session note templates for psychologists.

  Given the patient's name and a summary of the session, create a comprehensive session note template.
  Consider the therapist's instructions, if any, to tailor the template.

  Patient Name: {{{patientName}}}
  Session Summary: {{{sessionSummary}}}
  Therapist Instructions: {{{therapistInstructions}}}

  Template:
  `,
});

const generateSessionNoteTemplateFlow = ai.defineFlow(
  {
    name: 'generateSessionNoteTemplateFlow',
    inputSchema: GenerateSessionNoteTemplateInputSchema,
    outputSchema: GenerateSessionNoteTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
