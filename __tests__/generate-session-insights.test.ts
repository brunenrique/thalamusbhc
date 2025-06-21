import { generateSessionInsights } from '../src/ai/flows/generate-session-insights'
import { ai } from '../src/ai/genkit'

jest.mock('../src/ai/genkit', () => ({
  ai: { definePrompt: () => () => ({ output: { keywords: [], themes: [], symptomEvolution: '', suggestiveInsights: '' } }), defineFlow: (_cfg: any, fn: any) => fn }
}))

describe('generateSessionInsights', () => {
  it('retorna sucesso', async () => {
    const res = await generateSessionInsights({ sessionNotes: 'ok' })
    expect(res.success).toBe(true)
  })
})
