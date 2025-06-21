
import { NextResponse, type NextRequest } from 'next/server'
import { auth as adminAuth } from 'firebase-admin'

const PUBLIC_PATHS = ['/login']

function isPublic(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/api/public/')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  let authenticated = false

  if (bearerToken) {
    try {
      await adminAuth().verifyIdToken(bearerToken)
      authenticated = true
    } catch (err) {
      console.error('Token Firebase inválido', err)
    }
  } else {
    const nextAuthToken =
      request.cookies.get('next-auth.session-token')?.value ??
      request.cookies.get('__Secure-next-auth.session-token')?.value
    if (nextAuthToken) {
      authenticated = true
    }
  }

  if (!authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|public).*)'],
}
