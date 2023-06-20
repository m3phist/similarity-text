import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const redis = new Redis({
  url: 'UPSTASH_REDIS_REST_URL',
  token: 'UPSTASH_REDIS_REST_TOKEN',
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1h'),
});

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname; // relative path

    // Manage rate limiting *limit request per interval*
    if (pathname.startsWith('/api')) {
      const ip = req.ip ?? '127.0.0.1';
      try {
        const { success } = await ratelimit.limit(ip);

        if (!success) return NextResponse.json({ error: 'Too many requests' });
        return NextResponse.next();
      } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' });
      }
    }

    // Manage protection route
    const token = await getToken({ req });
    const isAuth = !!token;

    const isAuthPage = pathname.startsWith('/login');

    const sensitiveRoutes = ['/dashboard'];

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      return null;
    }

    if (
      !isAuth &&
      sensitiveRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/api/:path*'],
};
