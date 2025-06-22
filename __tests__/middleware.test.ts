import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('middleware', () => {
  it('permite rota pública', async () => {
    const req = new NextRequest('http://localhost/login');
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it('redireciona sem token', async () => {
    const req = new NextRequest('http://localhost/protected');
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });
    const res = await middleware(req);
    expect(res.headers.get('location')).toContain('/login');
  });

  it('permite acesso com token válido', async () => {
    const req = new NextRequest('http://localhost/protected', {
      headers: { Authorization: 'Bearer valid-token' },
    });
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: true });
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });
});
