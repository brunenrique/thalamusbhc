import { NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const decoded = await adminAuth().verifyIdToken(idToken);
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });
    const userRecord = await adminAuth().getUser(decoded.uid);
    const role = userRecord.customClaims?.role || 'Psychologist';
    const session = { user: { uid: decoded.uid, role } };
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    });
    return response;
  } catch (e) {
    console.error('Login API error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
