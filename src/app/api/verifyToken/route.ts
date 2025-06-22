import { NextResponse, type NextRequest } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';

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
    globalThis.console.error('Falha ao verificar token', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
