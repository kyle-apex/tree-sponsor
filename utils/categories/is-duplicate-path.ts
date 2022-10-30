import { prisma } from 'utils/prisma/init';
const isDuplicatePath = async (path: string): Promise<boolean> => {
  const category = await prisma.category.findFirst({ where: { path } });

  return category?.id ? true : false;
};
export default isDuplicatePath;
