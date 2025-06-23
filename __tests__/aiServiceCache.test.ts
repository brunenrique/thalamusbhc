import { generateSessionInsights, DEFAULT_CACHE_TTL_MS } from '../src/services/aiService';
import '../tests/setupLocalStorage';
import { TextEncoder } from 'util';

(global as any).TextEncoder = TextEncoder;

describe('aiService cache', () => {
  const input = { sessionNotes: 'ok' };

  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('reutiliza resposta em cache', async () => {
    const first = await generateSessionInsights(input);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const second = await generateSessionInsights(input);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
  });

  it('expira após TTL', async () => {
    await generateSessionInsights(input);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(DEFAULT_CACHE_TTL_MS + 1000);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });

    const res = await generateSessionInsights(input);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ success: false });
  });
});
