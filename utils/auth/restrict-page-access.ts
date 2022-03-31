import { GetSessionOptions, getSession } from 'next-auth/client';
import { hasAccessForQueriedUser } from 'utils/prisma/has-access-for-queried-user';
import { AccessType } from './AccessType';

export default async function restrictPageAccess(ctx: GetSessionOptions, accessType: AccessType | AccessType[]) {
  const session = await getSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: '/signin', //api/auth/signin
        permanent: false,
      },
    };
  }

  const hasAccess = hasAccessForQueriedUser({ email: session.user.email }, accessType);

  if (!hasAccess) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
