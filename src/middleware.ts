
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily allow all requests by bypassing auth checks
  return NextResponse.next();
}

// This config matches all routes.
// Adjust if specific public/private routes are reintroduced later.
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
};
