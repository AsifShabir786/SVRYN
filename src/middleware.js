import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const publicPaths = ['/user-login', '/user-login'];

  const isPublic = publicPaths.includes(request.nextUrl.pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/user-login', request.url));
  }

  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
