import { CheckinFields, PartialUser } from 'interfaces';

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
    user = await prisma.user.create({ data: { email, name: `${firstName} ${lastName}`.trim(), profile: {} } });
  }
  return user;
};
export default findOrCreateCheckinUser;
