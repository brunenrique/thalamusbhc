export { generateSessionInsightsPrompt } from './session-insights';
export { generateReportDraftPrompt } from './report-draft';
export { generateSessionNoteTemplatePrompt } from './session-note-template';
export { clinicalSupervisionMasterPrompt } from './clinical-supervision';

const prompts = {
  generateSessionInsights: generateSessionInsightsPrompt,
  generateReportDraft: generateReportDraftPrompt,
  generateSessionNoteTemplate: generateSessionNoteTemplatePrompt,
  clinicalSupervisionMaster: clinicalSupervisionMasterPrompt,
};

export function getPrompt(name: keyof typeof prompts) {
  return prompts[name];
}
