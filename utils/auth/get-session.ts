import { getSession as getNextSession, GetSessionOptions } from 'next-auth/client';
import { Session, NextSession } from 'interfaces';
export async function getSession(options?: GetSessionOptions): Promise<Session | null> {
  return getNextSession(options).then((nextSession: NextSession) => {
    return nextSession as Session;
  });
}
