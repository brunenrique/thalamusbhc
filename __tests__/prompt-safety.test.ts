import { generateSessionInsightsPrompt } from '../src/ai/prompts/session-insights';
import { generateReportDraftPrompt } from '../src/ai/prompts/report-draft';
import { generateSessionNoteTemplatePrompt } from '../src/ai/prompts/session-note-template';
import { clinicalSupervisionMasterPrompt } from '../src/ai/prompts/clinical-supervision';

const prompts = [
  generateSessionInsightsPrompt,
  generateReportDraftPrompt,
  generateSessionNoteTemplatePrompt,
  clinicalSupervisionMasterPrompt,
];

describe('IA prompts', () => {
  it.each(prompts)('inclui aviso de uso seguro', (prompt) => {
    expect(prompt.toLowerCase()).toMatch(/n\u00e3o/);
  });
});
