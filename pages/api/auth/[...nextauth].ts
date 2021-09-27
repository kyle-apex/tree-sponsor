import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    /*Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),*/
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Passwordless / email sign in
    Providers.Email({
      server: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY2,
        },
      },
      from: 'yp@treefolks.org',
    }),
  ],
  // Optional SQL or MongoDB database to persist users
  database: process.env.DATABASE_URL,
  adapter: Adapters.Prisma.Adapter({ prisma }),
  linkOAuthWithExistingUser: true,
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin?message=A%20sign%20in%20link%20has%20been%20sent%20to%20your%20email%20address',
  },
});
