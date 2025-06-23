/**
 * @openapi
 * /api/verifyToken:
 *   post:
 *     summary: Verifica a validade de um token Firebase.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorization:
 *                 type: string
 *                 description: Bearer token no header Authorization.
 *     responses:
 *       '200':
 *         description: Token válido.
 *       '401':
 *         description: Token ausente ou inválido.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token ausente' }, { status: 401 });
  }

  try {
    await adminAuth().verifyIdToken(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    Sentry.captureException(err);
    globalThis.console.error('Falha ao verificar token', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
