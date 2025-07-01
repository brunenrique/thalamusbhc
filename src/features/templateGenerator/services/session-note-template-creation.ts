'use server';

/**
 * @fileOverview An AI agent for assisting in creating session note templates.
 *
 * - createSessionNoteTemplate - A function that handles the session note template creation process.
 * - CreateSessionNoteTemplateInput - The input type for the createSessionNoteTemplate function.
 * - CreateSessionNoteTemplateOutput - The return type for the createSessionNoteTemplate function.
 */

import {ai} from '@/lib/genkit';
import {z} from 'genkit';

const CreateSessionNoteTemplateInputSchema = z.object({
  templateName: z.string().describe('O nome do modelo de anotação de sessão.'),
  psychologistStyle: z
    .string()
    .describe(
      'O estilo de escrita e as preferências do psicólogo que está criando o modelo.'
    ),
  sessionType: z.string().describe('O tipo de sessão de terapia.'),
  keywords: z.string().optional().describe('Palavras-chave relevantes para a sessão.'),
});
export type CreateSessionNoteTemplateInput = z.infer<
  typeof CreateSessionNoteTemplateInputSchema
>;

const CreateSessionNoteTemplateOutputSchema = z.object({
  templateContent: z
    .string()
    .describe('O conteúdo do modelo de anotação de sessão.'),
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
  prompt: `Você é um assistente de IA que ajuda psicólogos a criar modelos de anotações de sessão.

  Com base no estilo do psicólogo, tipo de sessão e palavras-chave, gere um modelo de anotação de sessão com sugestões inteligentes de preenchimento automático.

  Estilo do Psicólogo: {{{psychologistStyle}}}
  Tipo de Sessão: {{{sessionType}}}
  Palavras-chave: {{{keywords}}}

  Nome do Modelo: {{{templateName}}}

  Conteúdo do Modelo:`, // Let the LLM generate the template content.
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
