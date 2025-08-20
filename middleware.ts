import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
 

export function middleware(request: NextRequest) {
const path = request.nextUrl.pathname

  const isPublicPath = path === '/customer-login-register'  

  const token = request.cookies.get('token')?.value || ''

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/customer-login-register', request.nextUrl))
  }
    
}

 
// See "Matching Paths" below to learn more
export const config = {
matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}