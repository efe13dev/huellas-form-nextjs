import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Usar console.log solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('URL:', request.nextUrl.pathname);
    console.log('Session:', session);
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET); // Añadir esta línea
  }

  // Comprobar si estamos en desarrollo y no hay sesión
  if (process.env.NODE_ENV === 'development' && !session) {
    console.warn('No se encontró sesión en desarrollo. Permitiendo acceso...');
    return NextResponse.next();
  }

  if (
    !session &&
    (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/list')
  ) {
    // Redirigir a /login si no hay sesión
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Permitir el acceso si hay sesión o si la ruta no requiere autenticación
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/list']
};
