import NextAuth, { Profile } from 'next-auth';
import Providers from 'next-auth/providers';
import { createTransport } from 'nodemailer';
import Adapters from 'next-auth/adapters';
import { prisma } from 'utils/prisma/init';
import { generateProfilePath } from 'utils/user/generate-profile-path';
import { User } from '.prisma/client';
import { Session, PartialUser } from 'interfaces';
import { AccessTypes } from 'utils/auth/AccessType';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import { Adapter } from './custom-prisma-nextauth-adapter';
import sendEmailSES from 'utils/email/send-email-ses';

function getProfilePictureUrl(profile: Profile): string {
  console.log('profile', profile);
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
    /*Providers.Instagram({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),this does not give their email address*/
    /*Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),*/
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Passwordless / email sign in
    Providers.Email({
      server:
        process.env.USE_SES_FOR_AUTH === 'true'
          ? {} // Empty server config when using SES
          : {
              host: process.env.SENDGRID_HOST || 'smtp.sendgrid.net',
              port: Number(process.env.SENDGRID_PORT) || 587,
              auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY2,
              },
            },
      maxAge: 60 * 15,
      from: process.env.SES_SENDER_EMAIL || 'yp@treefolks.org',
      async sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
        const { host } = new URL(url);

        // Use Amazon SES if configured
        if (process.env.USE_SES_FOR_AUTH === 'true') {
          try {
            const result = await sendEmailSES(
              [email],
              'TreeFolksYP Login Link',
              text({ url, host }),
              html({ url, host, email }),
              'TreeFolks Young Professionals',
            );

            if (!result) {
              console.error(`Failed to send verification email via SES to ${email}`);
              throw new Error('Failed to send verification email');
            }
          } catch (error) {
            console.error('Error sending verification email via SES:', error);
            throw new Error('Failed to send verification email');
          }
        } else {
          // Use SendGrid via nodemailer (original implementation)
          const transport = createTransport(server);
          await transport.sendMail({
            to: email,
            from,
            subject: `TreeFolksYP Login Link`,
            text: text({ url, host }),
            html: html({ url, host, email }),
          });
        }
      },
    }),
  ],
  // Optional SQL or MongoDB database to persist users
  database: process.env.DATABASE_URL,
  adapter: Adapter({ prisma }),
  linkOAuthWithExistingUser: true,
  callbacks: {
    async session(session: Session, user): Promise<Session> {
      session.user = user;
      if (!session.user.roles && session.user.id) {
        const userWithRoles = (await prisma.user.findFirst({
          where: { id: session.user.id },
          include: {
            roles: {},
            subscriptions: {},
            eventCheckIns: { include: { event: { include: { location: true } } }, where: { eventId: { not: null } } },
            profile: {},
          },
        })) as PartialUser;

        if (userWithRoles.roles) session.user.roles = userWithRoles.roles;
        if (userWithRoles.profile) session.user.profile = userWithRoles.profile;
        if (userWithRoles.subscriptions) session.user.subscriptions = userWithRoles.subscriptions;
        if (userWithRoles.eventCheckIns) {
          parseResponseDateStrings(userWithRoles.eventCheckIns);
          session.user.eventCheckIns = userWithRoles.eventCheckIns;

          userWithRoles.eventCheckIns.sort((a, b) => {
            return a.event?.startDate > b.event?.startDate ? -1 : 1;
          });
        }
      }
      return session;
    },
    async signIn(user, _account, profile) {
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
    async redirect(url, baseUrl) {
      try {
        // Case 1: The URL is a relative path (like /checkin)
        if (url.startsWith('/') && !url.startsWith('//')) {
          return baseUrl + url;
        }

        // Case 2: The URL contains a callbackUrl parameter
        let parsedUrl;
        try {
          parsedUrl = new URL(url, baseUrl);

          if (parsedUrl.searchParams.has('callbackUrl')) {
            const callbackUrl = parsedUrl.searchParams.get('callbackUrl');

            // If callbackUrl exists and is a relative URL (starts with /)
            if (callbackUrl && callbackUrl.startsWith('/')) {
              return baseUrl + callbackUrl;
            }
          }
        } catch (error) {
          console.error('Error parsing URL:', error);
        }

        // Case 3: The URL is an absolute URL that we should use directly
        if (url.startsWith(baseUrl)) {
          return url;
        }
      } catch (error) {
        console.error('Error in redirect callback:', error);
      }

      // Default fallback to account page
      return baseUrl + '/account';
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
