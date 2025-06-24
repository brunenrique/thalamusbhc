import { generateSessionInsights } from '../src/ai/sessionInsights';
import { ai } from '../src/ai/genkit';

jest.mock('../src/ai/genkit', () => {
  const { createMockAI } = require('../src/tests/__mocks__/ai');
  return { ai: createMockAI({ feelings: [], topics: [], suggestions: [] }) };
});

describe('generateSessionInsights', () => {
  it('retorna sucesso', async () => {
    const res = await generateSessionInsights({ summary: 'texto' });
    expect(res.success).toBe(true);
  });
});
