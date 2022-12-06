import NextAuth, { Profile } from 'next-auth';
import Providers from 'next-auth/providers';
import { createTransport } from 'nodemailer';
import Adapters from 'next-auth/adapters';
import { prisma } from 'utils/prisma/init';
import { generateProfilePath } from 'utils/user/generate-profile-path';
import { User } from '.prisma/client';
import { Session, PartialUser } from 'interfaces';
import { AccessTypes } from 'utils/auth/AccessType';

function getProfilePictureUrl(profile: Profile): string {
  if (typeof profile?.picture === 'string') return profile.picture;
  else if (profile?.picture) {
    const picture = profile.picture as Record<string, any>;
    return picture.data.url;
  }

  return '';
}

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
        host: process.env.SENDGRID_HOST || 'smtp.sendgrid.net',
        port: Number(process.env.SENDGRID_PORT) || 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY2,
        },
      },
      from: 'yp@treefolks.org',
      sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        transport.sendMail({
          to: email,
          from,
          subject: `TreeFolksYP Login Link`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        });
      },
    }),
  ],
  // Optional SQL or MongoDB database to persist users
  database: process.env.DATABASE_URL,
  adapter: Adapters.Prisma.Adapter({ prisma }),
  linkOAuthWithExistingUser: true,
  callbacks: {
    async session(session: Session, user): Promise<Session> {
      session.user = user;
      if (!session.user.roles && session.user.id) {
        const userWithRoles = (await prisma.user.findFirst({
          where: { id: session.user.id },
          include: { roles: {} },
        })) as PartialUser;

        if (userWithRoles.roles) session.user.roles = userWithRoles.roles;
      }
      return session;
    },
    async signIn(user, _account, profile) {
      //console.log('profile', profile);
      //console.log('user', user);
      const profilePictureUrl = getProfilePictureUrl(profile);
      let hasUpdate;
      const updateData: Partial<User> = {};
      if (user?.id && !user.image && profilePictureUrl) {
        user.image = profilePictureUrl;
        updateData.image = user.image;
        hasUpdate = true;
      }

      if (user?.id && !user.name && typeof profile?.name === 'string') {
        user.name = profile.name;
        updateData.name = user.name;
        hasUpdate = true;
      }

      if (!user?.profilePath) {
        user.profilePath = generateProfilePath(user as User);
        updateData.profilePath = user.profilePath as string;
      }

      if (hasUpdate) await prisma.user.update({ where: { id: user.id as number }, data: updateData });
      return true;
    },
  },
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin?message=A%20sign%20in%20link%20has%20been%20sent%20to%20your%20email%20address',
  },
});

function html({ url, email }: Record<'url' | 'host' | 'email', string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
  //const escapedHost = `${host.replace(/\./g, '&#8203;.')}`;

  // Some simple styling options
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';
  const buttonBackgroundColor = '#486e62';
  const buttonBorderColor = '#486e62';
  const buttonTextColor = '#ffffff';
  //${escapedHost}
  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>TreeFolks Young Professionals</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong> to manage your account and donations.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 40px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<'url' | 'host', string>) {
  return `Sign in to ${host}\n${url}\n\n`;
}
