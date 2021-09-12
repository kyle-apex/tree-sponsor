import { GetSessionOptions, getSession } from 'next-auth/client';
import { hasAccessForQueriedUser } from 'utils/prisma/has-access-for-queried-user';

export default async function serverSideIsAdmin(ctx: GetSessionOptions) {
  const session = await getSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: '/login', //api/auth/signin
        permanent: false,
      },
    };
  }

  const isAdmin = hasAccessForQueriedUser({ email: session.user.email }, 'isAdmin');

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
