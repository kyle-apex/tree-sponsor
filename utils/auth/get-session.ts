import { getSession as getNextSession, GetSessionOptions } from 'next-auth/client';
import { Session as PrismaSession, User } from '.prisma/client';
export type Session = Partial<PrismaSession> & { user?: User };
export async function getSession(options?: GetSessionOptions): Promise<Session | null> {
  return getNextSession(options).then((nextSession: any) => {
    console.log('next session', nextSession);
    return nextSession;
  });
}
