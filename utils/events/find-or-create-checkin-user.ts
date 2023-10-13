import { CheckinFields, PartialUser } from 'interfaces';
import { prisma } from 'utils/prisma/init';
import { generateProfilePath } from 'utils/user/generate-profile-path';

const findOrCreateCheckinUser = async (fields: CheckinFields) => {
  if (!fields) return;
  const { email, firstName, lastName } = fields;
  let user = (await prisma.user.findFirst({ where: { email }, include: { profile: {} } })) as PartialUser;

  if (user && !user.profile) {
    user.profile = await prisma.profile.create({ data: { userId: user.id } });
  }

  if (user && !user.name && firstName) {
    user.name = `${firstName} ${lastName}`.trim();
    await prisma.user.update({ where: { email }, data: { name: user.name } });
  }
  if (!user && firstName) {
    const profilePath = generateProfilePath({ email, name: `${firstName} ${lastName}`.trim() });
    user = await prisma.user.create({ data: { email, name: `${firstName} ${lastName}`.trim(), profilePath, profile: {} } });
  }
  return user;
};
export default findOrCreateCheckinUser;
