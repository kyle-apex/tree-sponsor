import { PartialUser } from 'interfaces';
import { prisma } from 'utils/prisma/init';

export const getUserByEmail = async (email: string, filter?: any): Promise<PartialUser> => {
  if (!filter) filter = {};
  let user;
  const users = (await prisma.user.findMany({
    where: { OR: [{ email: email }, { email2: email }] },
    ...filter,
  })) as PartialUser[];

  if (users?.length == 1) user = users[0];
  else if (users?.length > 1) {
    user = users.find(u => u.email == email);
    if (!user) user = users[0];
  }
  return user;
};
