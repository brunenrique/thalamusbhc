import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import * as Sentry from '@sentry/nextjs';

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
    if (decoded.role !== 'Admin') {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }

    await adminAuth().setCustomUserClaims(uid, { role });
    return NextResponse.json({ success: true });
  } catch (e) {
    Sentry.captureException(e);
    console.error('Erro ao definir papel', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
