import { DEFAULT_TITLE_PREFIX } from 'consts';
import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import { prisma } from 'utils/prisma/init';
import { getFirstName } from 'utils/user/get-first-name';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (!id) return throwError(res, 'No sponsorship specified');

  if (req.method === 'GET') {
    const reactions = await prisma.reaction.findMany({
      where: { sponsorshipId: id },
      include: { user: { select: { name: true, displayName: true, image: true, profilePath: true, id: true } } },
      orderBy: { createdDate: 'asc' },
    });
    res.status(200).json(reactions);
  } else if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session?.user?.id) return throwUnauthenticated(res);

    const userId = session.user.id;

    const newReaction = await prisma.reaction.create({ data: { userId, createdDate: new Date(), ...req.body } });
    const reaction = await prisma.reaction.findFirst({ where: { id: newReaction.id }, include: { user: {} } });

    const sponsorship = await prisma.sponsorship.findFirst({ where: { id: id }, include: { user: true } });

    await prisma.notification.create({
      data: {
        userId: sponsorship.userId,
        sourceUserId: userId,
        type: 'reaction',
        link: `/u/${sponsorship.user.profilePath}?t=${id}`,
        parameter: sponsorship.title || DEFAULT_TITLE_PREFIX + getFirstName(sponsorship.user),
        createdDate: new Date(),
      },
    });

    res.status(200).json(reaction);
  }
}
