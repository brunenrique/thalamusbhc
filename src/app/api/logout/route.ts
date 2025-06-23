/**
 * @openapi
 * /api/logout:
 *   post:
 *     summary: Remove o cookie de sessão do usuário.
 *     responses:
 *       '200':
 *         description: Sessão encerrada com sucesso.
 */
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
  return response;
}
