import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // These routes are now valid since we changed the folder name to "auth" without parentheses
  // but we'll keep the middleware to handle bookmarks or other links that might use old paths
  
  if (request.nextUrl.pathname === '/signin') {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  
  if (request.nextUrl.pathname === '/signup') {
    return NextResponse.redirect(new URL('/auth/signup', request.url))
  }
  
  if (request.nextUrl.pathname === '/forgot-password') {
    return NextResponse.redirect(new URL('/auth/forgot-password', request.url))
  }
  
  if (request.nextUrl.pathname === '/reset-password') {
    const url = new URL('/auth/reset-password', request.url)
    // Preserve the token query parameter if it exists
    const token = request.nextUrl.searchParams.get('token')
    if (token) {
      url.searchParams.set('token', token)
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/signin', '/signup', '/forgot-password', '/reset-password'],
}
