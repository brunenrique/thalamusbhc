export async function trackFlow<TInput, TOutput>(
  name: string,
  fn: (input: TInput) => Promise<TOutput>,
  input: TInput
): Promise<TOutput> {
  const start = Date.now();
  const result = await fn(input);
  const duration = Date.now() - start;
  logUsage(name, input, result, duration);
  return result;
}

function logUsage(name: string, input: unknown, output: unknown, ms: number) {
  const inSize = JSON.stringify(input).length;
  const outSize = JSON.stringify(output).length;
  console.info(`[AI] ${name} ${ms}ms in/out ${inSize}/${outSize}`);
}
