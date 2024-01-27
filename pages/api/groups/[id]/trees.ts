import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, Prisma } from 'utils/prisma/init';
import { PartialTree } from 'interfaces';
import { getUserByEmail } from 'utils/user/get-user-by-email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const groupId = Number(req.query.id);
    const email = String(req.query.email);

    const user = email ? await getUserByEmail(email, { select: { id: true } }) : null;

    const includeFilter: Prisma.TreeInclude = {
      images: { orderBy: { sequence: 'asc' } },
      species: { select: { id: true, commonName: true, height: true, growthRate: true, longevity: true, isInTexas: true } },
      speciesQuizResponses: { where: { userId: user?.id } },
    };

    if (!user?.id) delete includeFilter.speciesQuizResponses;

    const treeToGroups = await prisma.treeToGroup.findMany({
      where: { groupId },
      include: { tree: { include: includeFilter } },
    });

    const trees: PartialTree[] = treeToGroups
      .map(item => {
        const tree = item.tree;
        return {
          ...tree,
          sequence: item.sequence,
        };
      })
      .filter((tree: PartialTree) => {
        return tree.sequence !== null && tree.images?.length > 0;
      });

    res.status(200).json(trees);
  }
}
