import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/'];

const adminPrefix = '/admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    const sessionRes = await fetch(
      new URL('/api/auth/get-session', request.url),
      {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      },
    );

    let sessionData = null;
    if (sessionRes.ok) {
      sessionData = await sessionRes.json();
    }

    const user = sessionData?.user;
    const isPublicRoute = publicRoutes.includes(pathname);

    if (pathname.startsWith(adminPrefix)) {
      if (!user || user.role !== 'admin') {
        return NextResponse.rewrite(new URL('/404', request.url));
      }
      return NextResponse.next();
    }
    if (user) {
      if (isPublicRoute) {
        if (user.role === 'admin') {
          return NextResponse.redirect(
            new URL('/admin/dashboard', request.url),
          );
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } else {
      if (!isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Session Error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
