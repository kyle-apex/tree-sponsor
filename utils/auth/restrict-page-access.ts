import { GetSessionOptions, getSession } from 'next-auth/client';
import { hasAccessForQueriedUser } from 'utils/prisma/has-access-for-queried-user';
import { AccessType } from './AccessType';

type AccessResponse = {
  redirect?: {
    destination: string;
    permanent: boolean;
  };
  props?: {
    path?: string;
    id?: number;
  };
};

export default async function restrictPageAccess(ctx: GetSessionOptions, accessType: AccessType | AccessType[]): Promise<AccessResponse> {
  const session = await getSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: '/signin', //api/auth/signin
        permanent: false,
      },
    };
  }

  const hasAccess = await hasAccessForQueriedUser({ OR: [{ email: session.user.email }, { email2: session.user.email }] }, accessType);

  if (!hasAccess) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}
