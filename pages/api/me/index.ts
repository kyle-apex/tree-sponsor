import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import getProfileImagePath from 'utils/aws/get-profile-image-path';
import uploadImage from 'utils/aws/upload-image';
import { prisma } from 'utils/prisma/init';
import isDuplicateProfilePath from 'utils/user/is-duplicate-profile-path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) return throwUnauthenticated(res);

  const userId = session.user.id;
  console.log('userId', userId);

  const imageUrl = req.body.image;

  if (imageUrl && !imageUrl.startsWith('http')) {
    const fileContent = imageUrl.split(',')[1];

    req.body.image =
      (await uploadImage(
        fileContent,
        imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';')),
        getProfileImagePath(session.user.email),
      )) +
      '?d=' +
      new Date().getTime();
  }
  if (req.method === 'GET') {
    const obj = await prisma.user.findFirst({
      where: { id: userId },
      include: { profile: true },
    });
    res.status(200).json(obj);
  } else if (req.method === 'PATCH') {
    const profilePath = req.body.profilePath;
    console.log('profilePath', profilePath);
    console.log('body', req.body);
    console.log('email', session.user?.email);

    if (profilePath) {
      const isDuplicate = await isDuplicateProfilePath(userId, profilePath);
      if (isDuplicate) return throwError(res, `The profile path "${profilePath}" is already in use.`);
    }
    const obj = await prisma.user.update({ where: { id: userId }, data: req.body });
    res.status(200).json(obj);
  }
}
