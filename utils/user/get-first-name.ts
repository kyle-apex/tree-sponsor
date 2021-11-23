import { PartialUser } from 'interfaces';
export const getFirstName = (user: PartialUser): string => {
  if (!user) return '';
  const name = user.displayName || user.name;
  return name ? name.split(' ')[0] : 'Anonymous';
};
