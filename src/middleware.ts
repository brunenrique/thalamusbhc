
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Skip middleware for static assets and API routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    console.debug('Middleware skip:', pathname);
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) {
    if (pathname === '/login') {
      return NextResponse.next();
    }
    console.debug('No session, redirecting to login from', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// This config matches all routes.
// Adjust if specific public/private routes are reintroduced later.
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
};
