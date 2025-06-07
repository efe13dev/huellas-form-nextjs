import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const cookie =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    !session &&
    (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/list")
  ) {
    // Redirigir a /login si no hay sesión, incluso en desarrollo
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Permitir el acceso si hay sesión o si la ruta no requiere autenticación
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/list"],
};
