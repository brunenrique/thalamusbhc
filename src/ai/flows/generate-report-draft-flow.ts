'use server';
/**
 * @fileOverview An AI agent for generating drafts of clinical reports from session notes.
 *
 * - generateReportDraft - A function that handles the report draft generation process.
 * - GenerateReportDraftInput - The input type for the generateReportDraft function.
 * - GenerateReportDraftOutput - The return type for the generateReportDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateReportDraftInputSchema = z.object({
  sessionNotes: z.string().describe('The session notes to base the report on.'),
  patientName: z.string().describe('The name of the patient.'),
  reportType: z.enum(["progress_report", "referral_letter", "session_summary"]).describe('The type of report to generate.'),
  therapistName: z.string().optional().describe('The name of the therapist (e.g., Dr. Silva).'),
});
export type GenerateReportDraftInput = z.infer<typeof GenerateReportDraftInputSchema>;

export const GenerateReportDraftOutputSchema = z.object({
  draftContent: z.string().describe('The generated draft content of the report.'),
});
export type GenerateReportDraftOutput = z.infer<typeof GenerateReportDraftOutputSchema>;

export async function generateReportDraft(input: GenerateReportDraftInput): Promise<GenerateReportDraftOutput> {
  return generateReportDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportDraftPrompt',
  input: {schema: GenerateReportDraftInputSchema},
  output: {schema: GenerateReportDraftOutputSchema},
  prompt: `Você é um assistente de IA especializado em ajudar psicólogos a redigir documentos clínicos.
Com base nas notas da sessão fornecidas, no nome do paciente e no tipo de relatório solicitado, gere um rascunho conciso e profissional.
{{#if therapistName}}O relatório pode ser assinado por {{therapistName}}.{{/if}}

Paciente: {{{patientName}}}
Notas da Sessão:
{{{sessionNotes}}}

Tipo de Relatório Solicitado: {{{reportType}}}

Instruções Específicas por Tipo de Relatório:
- Se 'progress_report': Foque em resumir o progresso do paciente desde a última atualização ou em um período relevante, destacando mudanças observadas, temas trabalhados e próximos passos.
- Se 'referral_letter': Elabore uma carta de encaminhamento formal. Inclua um breve resumo do caso, o motivo do encaminhamento, progresso até o momento (se relevante) e o que se espera do profissional/serviço para o qual o paciente está sendo encaminhado.
- Se 'session_summary': Crie um resumo breve e objetivo da sessão, ideal para um registro rápido ou para compartilhar com outros profissionais envolvidos no cuidado (com consentimento do paciente).

Por favor, gere apenas o conteúdo do rascunho do relatório.
`,
});

const generateReportDraftFlow = ai.defineFlow(
  {
    name: 'generateReportDraftFlow',
    inputSchema: GenerateReportDraftInputSchema,
    outputSchema: GenerateReportDraftOutputSchema,
  },
  async (input: GenerateReportDraftInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
