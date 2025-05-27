import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Handle redirects for old auth route patterns
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

  // Check for authentication for protected routes
  // This is a basic check that will be supplemented by the client-side ProtectedRoute component
  // We're doing the detailed auth check on the client side because we need to handle loading states
  // and redirects more gracefully
  
  // In a production app, you would check for a valid session cookie here
  // For simplicity in this example, we'll delegate most auth checks to the client-side component
  
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/signin', 
    '/signup', 
    '/forgot-password', 
    '/reset-password',
    // Protected routes patterns
    '/profile',
    '/dashboard/:path*',
    '/chat/:path*', // Add chat routes as protected
  ],
}
