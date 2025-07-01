<<<<<<< HEAD
import 'dotenv/config';
=======
>>>>>>> b01b3e35df346770f63206eb2370ec9184a585ef
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
