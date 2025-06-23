export function createMockAI(output: any) {
  return {
    definePrompt: () => () => ({ output }),
    defineFlow: (_cfg: unknown, fn: any) => fn,
  };
}

export const mockAI = createMockAI({});
