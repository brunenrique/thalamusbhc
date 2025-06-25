'use server';

/**
 * @fileOverview An AI agent for assisting in creating session note templates.
 *
 * - createSessionNoteTemplate - A function that handles the session note template creation process.
 * - CreateSessionNoteTemplateInput - The input type for the createSessionNoteTemplate function.
 * - CreateSessionNoteTemplateOutput - The return type for the createSessionNoteTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateSessionNoteTemplateInputSchema = z.object({
  templateName: z.string().describe('The name of the session note template.'),
  psychologistStyle: z
    .string()
    .describe(
      'The writing style and preferences of the psychologist creating the template.'
    ),
  sessionType: z.string().describe('The type of therapy session.'),
  keywords: z.string().optional().describe('Keywords relevant to the session.'),
});
export type CreateSessionNoteTemplateInput = z.infer<
  typeof CreateSessionNoteTemplateInputSchema
>;

const CreateSessionNoteTemplateOutputSchema = z.object({
  templateContent: z
    .string()
    .describe('The content of the session note template.'),
});
export type CreateSessionNoteTemplateOutput = z.infer<
  typeof CreateSessionNoteTemplateOutputSchema
>;

export async function createSessionNoteTemplate(
  input: CreateSessionNoteTemplateInput
): Promise<CreateSessionNoteTemplateOutput> {
  return createSessionNoteTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createSessionNoteTemplatePrompt',
  input: {schema: CreateSessionNoteTemplateInputSchema},
  output: {schema: CreateSessionNoteTemplateOutputSchema},
  prompt: `You are an AI assistant helping psychologists create session note templates.

  Based on the psychologist's style, session type, and keywords, generate a session note template with intelligent auto-completion suggestions.

  Psychologist Style: {{{psychologistStyle}}}
  Session Type: {{{sessionType}}}
  Keywords: {{{keywords}}}

  Template Name: {{{templateName}}}

  Template Content:`, // Let the LLM generate the template content.
});

const createSessionNoteTemplateFlow = ai.defineFlow(
  {
    name: 'createSessionNoteTemplateFlow',
    inputSchema: CreateSessionNoteTemplateInputSchema,
    outputSchema: CreateSessionNoteTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
