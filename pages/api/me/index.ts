import { NextApiRequest, NextApiResponse } from 'next';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import getProfileImagePath from 'utils/aws/get-profile-image-path';
import uploadImage from 'utils/aws/upload-image';
import { prisma } from 'utils/prisma/init';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const imageUrl = req.body.image;

  if (imageUrl && !imageUrl.includes('http')) {
    const fileContent = imageUrl.split(',')[1];

    req.body.image = await uploadImage(
      fileContent,
      imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';')),
      getProfileImagePath(session.user.email),
    );
  }

  if (req.method === 'GET') {
    const obj = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    res.status(200).json(obj);
  } else if (req.method === 'PATCH') {
    const obj = await prisma.user.update({ where: { id: session.user.id }, data: req.body });
    res.status(200).json(obj);
  }
}
