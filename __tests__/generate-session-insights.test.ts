import { generateSessionInsights } from '../src/ai/flows/generate-session-insights';
import { ai } from '../src/ai/genkit';

jest.mock('../src/ai/genkit', () => {
  const { createMockAI } = require('../src/tests/__mocks__/ai');
  return {
    ai: createMockAI({ keywords: [], themes: [], symptomEvolution: '', suggestiveInsights: '' }),
  };
});

describe('generateSessionInsights', () => {
  it('retorna sucesso', async () => {
    const res = await generateSessionInsights({ sessionNotes: 'ok' });
    expect(res.success).toBe(true);
  });
});
