import { prisma } from 'utils/prisma/init';
const isDuplicatePath = async (id: number, path: string): Promise<boolean> => {
  const form = await prisma.form.findFirst({ where: { id: { not: id || -1 }, path } });

  return form?.id ? true : false;
};
export default isDuplicatePath;
