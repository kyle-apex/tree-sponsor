import { User } from '.prisma/client';

export function generateProfilePath(user: User): string {
  const baseString = user.name ?? user.email.split('@')[0];
  const profilePath = baseString.replace(/ /g, '-').replace(/\./g, '-');
  return profilePath;
}
