
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily allow all requests by bypassing auth checks
  return NextResponse.next();

  /* Original logic:
  const sessionCookie = request.cookies.get('session')?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const session = JSON.parse(sessionCookie);
    const role = session.user?.role;
    if (role !== 'Psychologist' && role !== 'Admin') {
      return NextResponse.rewrite(new URL('/403', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    // Aplica o middleware em todas as rotas, exceto as públicas
    '/((?!api|_next/|login|signup|forgot-password|public).*)',
  ],
};
