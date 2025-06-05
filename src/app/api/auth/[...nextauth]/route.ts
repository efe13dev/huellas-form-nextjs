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
          credentials?.name === 'huellas' &&
          credentials?.password === 'huellas-1234'
        ) {
          return {
            id: '1',
            name: 'Huellas'
            /* email: 'huellas@ejemplo.com' */
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
  // Modificaciones sugeridas
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Añadir esta línea
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  debug: process.env.NODE_ENV === 'development' // Añadir esta línea
});

export { handler as GET, handler as POST };
