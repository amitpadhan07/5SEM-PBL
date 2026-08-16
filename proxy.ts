import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your_jwt_secret_key_here_min_32_characters'
);

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/verify-email',
  '/auth/forgot-password',
];

// Routes that require specific roles
const roleRoutes: Record<string, string[]> = {
  '/dashboard/admin': ['Admin'],
  '/dashboard/authority': ['Faculty', 'HOD', 'Exam Cell'],
  '/dashboard/analytics': ['Admin', 'Faculty', 'HOD', 'Exam Cell'],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if accessing protected route without token
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify JWT token
    const verified = await jwtVerify(token, secret);
    const decoded = verified.payload as any;

    // Check role-based access
    for (const [route, roles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route) && !roles.includes(decoded.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export async function middleware(request: NextRequest) {
  return proxy(request);
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
