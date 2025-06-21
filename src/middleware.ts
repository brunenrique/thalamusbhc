
import { type NextRequest, NextResponse } from 'next/server'
import { auth as adminAuth } from 'firebase-admin'

const PUBLIC_PATHS = ['/login']

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split('Bearer ')[1]

  if (token) {
    try {
      await adminAuth().verifyIdToken(token)
      return NextResponse.next()
    } catch (err) {
      console.error('Token Firebase inválido', err)
    }
  }
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!api/public|_next|favicon.ico|login).*)'],
}
