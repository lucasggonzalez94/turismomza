import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    if (!decoded) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// TODO: Definir rutas protegidas
export const config = {
  matcher: ['/protected/:path*', '/admin/:path*'],
};
