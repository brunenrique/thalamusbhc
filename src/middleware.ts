import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];

  if (token) {
    try {
      const verifyUrl = new globalThis.URL('/api/verifyToken', request.url);
      const res = await globalThis.fetch(verifyUrl.toString(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        return NextResponse.next();
      }
    } catch (err) {
      globalThis.console.error('Erro ao verificar token', err);
    }
  }
  return NextResponse.redirect(new globalThis.URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!api/verifyToken|api/public|_next|favicon.ico|login).*)'],
};
