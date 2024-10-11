import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
    } & DefaultSession['user'];
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: {
          label: 'Nombre de usuario',
          type: 'text',
          placeholder: 'Tu nombre de usuario'
        },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials, req) {
        // Verificamos las credenciales fijas
        if (
          credentials?.name === 'fido' &&
          credentials?.password === 'fido-1234'
        ) {
          return {
            id: '1',
            name: 'Fido'
            /* email: 'fido@ejemplo.com' */
          };
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user ?? {};
      session.user.id = token.id as string;
      return session;
    }
  },
  // Añade más opciones de configuración aquí
  secret: process.env.NEXTAUTH_SECRET,
  // Agrega esta línea para asegurar el uso de HTTPS en producción
  useSecureCookies: process.env.NODE_ENV === 'production',
  // Configura el tiempo de expiración de la sesión (por ejemplo, 30 días)
  session: {
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  // Configura las cookies para mayor seguridad
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
});

export { handler as GET, handler as POST };
