import { getSession as getNextSession, GetSessionOptions } from 'next-auth/client';
import { Session as NextSession } from 'next-auth';
import { Session } from 'interfaces';
export async function getSession(options?: GetSessionOptions): Promise<Session | null> {
  return getNextSession(options).then((nextSession: NextSession) => {
    return nextSession as Session;
  });
}
