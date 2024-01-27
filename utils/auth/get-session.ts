import { getSession as getNextSession, GetSessionOptions } from 'next-auth/client';
import { Session, NextSession } from 'interfaces';
export async function getSession(options?: GetSessionOptions): Promise<Session | null> {
  return getNextSession(options).then((nextSession: NextSession) => {
    console.log('nextSession', nextSession);
    return nextSession as Session;
  });
}
