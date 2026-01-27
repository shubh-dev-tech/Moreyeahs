import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sanitizeSlug, isMalformedSlug, isValidSlug } from './utils/slugUtils';

// AUTHENTICATION MIDDLEWARE - CURRENTLY DISABLED
// To enable authentication protection, set ENABLE_AUTH_MIDDLEWARE=true in your .env file

// Define protected routes (only enforced if middleware is enabled)
const protectedRoutes = [
  '/dashboard',
  // Add more protected routes here as needed
  // '/admin',
  // '/profile',
  // '/settings',
];

// Define public routes that should redirect to dashboard if authenticated
const authRoutes = [
  '/login',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle malformed case study URLs
  if (pathname.startsWith('/case-study/')) {
    const slug = pathname.replace('/case-study/', '');
    
    // Check if slug is malformed
    if (isMalformedSlug(slug)) {
      // Sanitize the slug
      const sanitizedSlug = sanitizeSlug(slug);
      
      // If sanitized slug is invalid, redirect to case studies list
      if (!isValidSlug(sanitizedSlug)) {
        return NextResponse.redirect(new URL('/case-study', request.url));
      }
      
      // Redirect to sanitized URL if it's different
      if (sanitizedSlug !== slug) {
        return NextResponse.redirect(new URL(`/case-study/${sanitizedSlug}`, request.url));
      }
    }
  }
  
  // Check if auth middleware is enabled
  const authEnabled = process.env.ENABLE_AUTH_MIDDLEWARE === 'true';
  
  if (!authEnabled) {
    // Auth middleware disabled - allow all requests
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get token from cookie or header
  const token = request.cookies.get('jwt_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (let them handle their own auth)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
