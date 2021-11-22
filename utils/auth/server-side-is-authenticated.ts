import { getSession, GetSessionOptions } from 'next-auth/client';

export default async function serverSideIsAuthenticated(ctx: GetSessionOptions) {
  const session = await getSession(ctx);
  console.log('session', session);

  if (!session?.user) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}
