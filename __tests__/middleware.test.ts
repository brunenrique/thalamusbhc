import { NextRequest } from 'next/server'
import { middleware } from '../src/middleware'
import { auth } from 'firebase-admin'

jest.mock('firebase-admin', () => ({ auth: jest.fn(() => ({ verifyIdToken: jest.fn() })) }))

describe('middleware', () => {
  it('permite rota pública', async () => {
    const req = new NextRequest('http://localhost/login')
    const res = await middleware(req)
    expect(res.status).toBe(200)
  })

  it('redireciona sem token', async () => {
    const req = new NextRequest('http://localhost/protected')
    const res = await middleware(req)
    expect(res.headers.get('location')).toContain('/login')
  })
})
