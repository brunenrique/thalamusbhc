/**
 * @openapi
 * /api/signup:
 *   post:
 *     summary: Cria um usuário no Firebase Auth.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Usuário criado.
 *       '400':
 *         description: Dados ausentes.
 *       '500':
 *         description: Erro interno ao criar usuário.
 */
import { NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 });
    }

    const user = await adminAuth().createUser({ email, password });
    await adminAuth().setCustomUserClaims(user.uid, { role: 'psychologist' });

    return NextResponse.json({ uid: user.uid, role: 'psychologist' });
  } catch (e) {
    Sentry.captureException(e);
    logger.error({ action: 'signup_api_error', meta: { error: e } });
    return NextResponse.json({ error: 'Erro interno ao criar usuário' }, { status: 500 });
  }
}
