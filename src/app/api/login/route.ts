/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Cria cookie de sessão a partir do idToken do Firebase.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Sessão criada com sucesso.
 *       '400':
 *         description: Falta o idToken no corpo da requisição.
 *       '500':
 *         description: Erro interno ao processar o login.
 */
/* eslint-env node */
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import { auth as adminAuth } from 'firebase-admin';
import { firestoreAdmin } from '@/lib/firebaseAdmin';
import { writeAuditLog } from '@/services/auditLogService';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const decoded = await adminAuth().verifyIdToken(idToken);
    await adminAuth().createSessionCookie(idToken, { expiresIn });
    const userRecord = await adminAuth().getUser(decoded.uid);
    const role = userRecord.customClaims?.role || 'Psychologist';
    const session = { user: { uid: decoded.uid, role } };
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      // eslint-disable-next-line no-undef
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    });
    logger.info({ userId: decoded.uid, action: 'login_api' });
    await writeAuditLog(
      {
        userId: decoded.uid,
        actionType: 'login',
        timestamp: new Date().toISOString(),
        targetResourceId: decoded.uid,
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
