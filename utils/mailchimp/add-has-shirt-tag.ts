import { prisma } from 'utils/prisma/init';
import addTagToMembersByName from './add-tag-to-members-by-name';

const addHasShirtTag = async () => {
  const usersWithShirts = await prisma.user.findMany({ where: { hasShirt: true }, select: { email: true, email2: true } });
  const emails: string[] = [];
  usersWithShirts?.forEach(user => {
    if (user.email && !emails.includes(user.email)) emails.push(user.email);
    if (user.email2 && !emails.includes(user.email2)) emails.push(user.email2);
  });
  await addTagToMembersByName('Has Shirt', emails);
  return emails;
};

export default addHasShirtTag;
