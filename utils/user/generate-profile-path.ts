import { PartialUser } from 'interfaces';

export function generateProfilePath(user: PartialUser): string {
  const baseString = user.name ?? user.email.split('@')[0];
  const profilePath = baseString.replace(/ /g, '-').replace(/\./g, '-');
  return profilePath.toLowerCase();
}
