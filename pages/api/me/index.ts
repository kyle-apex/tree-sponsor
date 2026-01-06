import { NextApiRequest, NextApiResponse } from 'next';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { getSession } from 'utils/auth/get-session';
import getProfileImagePath from 'utils/aws/get-profile-image-path';
import uploadImage from 'utils/aws/upload-image';
import { prisma } from 'utils/prisma/init';
import { getUserByEmail } from 'utils/user/get-user-by-email';
import isDuplicateProfilePath from 'utils/user/is-duplicate-profile-path';
import createInvitePreviewImage from 'utils/events/create-invite-preview-image';

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
    const email2 = req.body.email2;
    console.log('profilePath', profilePath);
    console.log('body', req.body);
    console.log('email', session.user?.email);

    // Get the current user's image before updating
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    const oldImage = currentUser?.image;

    if (profilePath) {
      const isDuplicate = await isDuplicateProfilePath(userId, profilePath);
      if (isDuplicate) return throwError(res, `The profile path "${profilePath}" is already in use.`);
    }
    if (email2) {
      const duplicateUser = await getUserByEmail(email2);
      if (duplicateUser && duplicateUser.id != userId) return throwError(res, `The email "${email2}" is already in use.`);
    }
    const obj = await prisma.user.update({ where: { id: userId }, data: req.body });

    // Check if the image was updated
    if (req.body.image && oldImage !== req.body.image) {
      try {
        // Find upcoming events where the user has RSVP'd
        const upcomingEvents = await prisma.event.findMany({
          where: {
            startDate: {
              gte: new Date(),
            },
            RSVPs: {
              some: {
                userId: userId,
              },
            },
          },
          select: {
            id: true,
            pictureUrl: true,
          },
        });

        console.log(`Found ${upcomingEvents.length} upcoming events with RSVPs for user ${userId}`);

        // Generate invite preview images for each event
        new Promise<void>(resolve => {
          (async () => {
            for (const event of upcomingEvents || []) {
              try {
                await createInvitePreviewImage(event.pictureUrl, `${event.id}-${userId}`, req.body.image);
                console.log(`Successfully created invite preview image for event ${event.id}`);
              } catch (error) {
                console.error(`Error creating invite preview image for event ${event.id}:`, error);
                // Continue processing other events even if one fails
              }
            }
            resolve();
          })();
        });
      } catch (error) {
        console.error('Error processing invite preview images:', error);
        // Don't fail the profile update if there's an error with invite preview images
      }
    }

    res.status(200).json(obj);
  }
}
