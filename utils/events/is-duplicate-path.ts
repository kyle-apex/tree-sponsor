import { prisma } from 'utils/prisma/init';
const isDuplicatePath = async (path: string): Promise<boolean> => {
  const event = await prisma.event.findFirst({ where: { path } });

  return event?.id ? true : false;
};
export default isDuplicatePath;
