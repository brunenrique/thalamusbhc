export const generateSessionNoteTemplatePrompt = `AVISO: O modelo gerado não substitui supervisão ou avaliação clínica.
You are an AI assistant that generates session note templates for psychologists.

  Given the patient's name and a summary of the session, create a comprehensive session note template.
  Consider the therapist's instructions, if any, to tailor the template.

  Patient Name: {{{patientName}}}
  Session Summary: {{{sessionSummary}}}
  Therapist Instructions: {{{therapistInstructions}}}

  Template:
  `;
