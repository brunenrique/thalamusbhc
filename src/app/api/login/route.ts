/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Autentica com email e senha pelo Firebase Auth.
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
 *         description: Sessão criada com sucesso.
 *       '400':
 *         description: Dados ausentes.
 *       '500':
 *         description: Erro interno ao processar o login.
 */
/* eslint-env node */
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import { auth as adminAuth } from 'firebase-admin';
import { USER_ROLES } from '@/constants/roles';
import { firestoreAdmin } from '@/lib/firebaseAdmin';
import { writeAuditLog } from '@/services/auditLogService';

// eslint-disable-next-line no-undef
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 });
    }

    if (!FIREBASE_API_KEY) {
      throw new Error('Firebase API key not configured');
    }

    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const { idToken, localId } = await res.json();

    const userRecord = await adminAuth().getUser(localId);
    if (!userRecord.emailVerified) {
      return NextResponse.json({ error: 'Email não verificado' }, { status: 401 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    await adminAuth().createSessionCookie(idToken, { expiresIn });
    const role = (userRecord.customClaims?.role as string | undefined) || USER_ROLES.PSYCHOLOGIST;
    const session = { user: { uid: localId, role } };
    const response = NextResponse.json({ token: idToken });
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      // eslint-disable-next-line no-undef
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    });
    logger.info({ userId: localId, action: 'login_api' });
    await writeAuditLog(
      {
        userId: localId,
        actionType: 'login',
        timestamp: new Date().toISOString(),
        targetResourceId: localId,
      },
      firestoreAdmin
    );
    return response;
  } catch (e) {
    Sentry.captureException(e);
    logger.error({ action: 'login_api_error', meta: { error: e } });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
