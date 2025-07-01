<<<<<<< HEAD
import 'dotenv/config';


import '@/ai/flows/generate-session-note-template.ts';
import '@/ai/flows/generate-session-insights.ts';
import '@/ai/flows/generate-report-draft-flow.ts';
import '@/ai/flows/clinical-supervision-flow.ts';
=======
import { config } from 'dotenv';
config();

import '@/ai/flows/session-insights.ts';
import '@/ai/flows/session-note-template-creation.ts';
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
