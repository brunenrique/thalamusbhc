/**
 * @openapi
 * /api/admin/setUserRole:
 *   post:
 *     summary: Define o papel de um usuário no Firebase.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Papel atualizado.
 *       '400':
 *         description: Dados ausentes.
 *       '401':
 *         description: Não autenticado.
 *       '403':
 *         description: Usuário sem permissão.
 *       '500':
 *         description: Erro interno.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';
import { USER_ROLES } from '@/constants/roles';

export async function POST(request: NextRequest) {
  try {
    const { uid, role } = await request.json();
    if (!uid || !role) {
      return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const decoded = await adminAuth().verifyIdToken(token);
    if (decoded.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }

    const requester = await adminAuth().getUser(decoded.uid);
    if (requester.customClaims?.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await adminAuth().setCustomUserClaims(uid, { role });
    return NextResponse.json({ success: true });
  } catch (e) {
    Sentry.captureException(e);
    logger.error({ action: 'set_user_role_error', meta: { error: e } });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
