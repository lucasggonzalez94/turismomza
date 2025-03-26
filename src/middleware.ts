import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const authHeader = request.headers.get('authorization');
  const hasToken = !!authHeader && authHeader.startsWith('Bearer ');

  // Si es una página de autenticación y el usuario está autenticado, redirigir al home
  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si no es una página de autenticación y el usuario no está autenticado, redirigir al login
  if (!isAuthPage && !hasToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas
export const config = {
  matcher: [
    '/notifications',
    // '/profile/:path*',
    // '/auth/:path*',
    // Agregar aquí otras rutas que necesiten protección
  ],
};
