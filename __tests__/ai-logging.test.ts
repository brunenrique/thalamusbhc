import { trackFlow } from '../src/ai/logging';

describe('trackFlow', () => {
  it('registra tempo e tamanhos', async () => {
    const fn = jest.fn(async (n: number) => n + 1);
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const res = await trackFlow('test', fn, 1);
    expect(res).toBe(2);
    expect(fn).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
