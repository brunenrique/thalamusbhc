import { generateSessionInsightsPrompt } from './session-insights';
import { generateReportDraftPrompt } from './report-draft';
import { generateSessionNoteTemplatePrompt } from './session-note-template';
import { clinicalSupervisionMasterPrompt } from './clinical-supervision';

export {
  generateSessionInsightsPrompt,
  generateReportDraftPrompt,
  generateSessionNoteTemplatePrompt,
  clinicalSupervisionMasterPrompt,
};

const prompts = {
  generateSessionInsights: generateSessionInsightsPrompt,
  generateReportDraft: generateReportDraftPrompt,
  generateSessionNoteTemplate: generateSessionNoteTemplatePrompt,
  clinicalSupervisionMaster: clinicalSupervisionMasterPrompt,
};

export function getPrompt(name: keyof typeof prompts) {
  return prompts[name];
}
