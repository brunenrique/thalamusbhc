
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily allow all requests by bypassing auth checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplica o middleware em todas as rotas, exceto as públicas
    '/((?!api|_next/|login|signup|forgot-password|public).*)',
  ],
};
