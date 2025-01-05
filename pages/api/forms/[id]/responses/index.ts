import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma, Prisma } from 'utils/prisma/init';
import { FormQuestion, PartialForm, PartialUser, ReviewStatus } from 'interfaces';
import { getUserByEmail } from 'utils/user/get-user-by-email';
import { FormResponse } from '@prisma/client';
import uploadImage from 'utils/aws/upload-image';
import getProfileImagePath from 'utils/aws/get-profile-image-path';
import addTagToMembersByName from 'utils/mailchimp/add-tag-to-members-by-name';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';
import findOrCreateCheckinUser from 'utils/events/find-or-create-checkin-user';
import addSubscriber from 'utils/mailchimp/add-subscriber';
import addEventToMember from 'utils/mailchimp/add-event-to-member';
import hasAccess from 'utils/auth/has-access';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (req.method === 'POST') {
    let userId: number;
    const formBody = req.body as FormResponse;
    const responsesJson = formBody.responsesJson as Prisma.JsonArray as FormQuestion[];

    const formId = Number(req.query.id);

    const form = await prisma.form.findFirst({ where: { id: formId } });

    if (!formBody.formId) formBody.formId = formId;

    const emailQuestion = responsesJson.find((q: FormQuestion) => q.type == 'user-email');
    const email = emailQuestion.value;

    const nameQuestion = responsesJson.find(q => q.type == 'user-name');
    const name = nameQuestion.value;

    const imageQuestions = responsesJson.filter(q => q.type == 'image' || q.type == 'user-image');

    let user: PartialUser;

    if (!email) throwError(res, 'Email address not found');

    if (session?.user?.id && session?.user?.email == email) {
      userId = session.user.id;
      user = await prisma.user.findFirst({ where: { id: userId }, include: { profile: {} } });
    } else {
      user = await getUserByEmail(email, { include: { profile: {} } });
      if (!user && name) {
        user = (await prisma.user.findFirst({
          where: { name },
          include: { profile: {} },
        })) as PartialUser;
      }
      if (user) userId = user.id;
    }

    if (!userId) {
      user = (await prisma.user.create({
        data: { name, email },
      })) as PartialUser;
      const splitName = name?.split(' ');
      const firstName = splitName.shift();
      const lastName = splitName?.length ? splitName.join(' ') : '';
      user = await findOrCreateCheckinUser({
        email,
        firstName,
        lastName,
      });
      await addSubscriber(email, { FNAME: firstName, LNAME: lastName }, false);
      userId = user.id;
    }

    const profileQuestions = [
      { type: 'profile-bio', propertyName: 'bio' },
      { type: 'profile-title', propertyName: 'title' },
    ];

    for (const profileQuestion of profileQuestions || []) {
      const question = responsesJson.find((q: FormQuestion) => q.type == profileQuestion.type);

      if (question?.value) {
        if (!user.profile) {
          user.profile = await prisma.profile.create({ data: { userId: user.id, [profileQuestion.propertyName]: question.value } });
        } else {
          await prisma.profile.update({ where: { id: user.profile.id }, data: { [profileQuestion.propertyName]: question.value } });
        }
      }
    }

    // do not let someone update someone elses response unless they are logged in
    let existingResponse;
    if (userId && session?.user?.id != userId) {
      existingResponse = await prisma.formResponse.findFirst({ where: { userId: userId, formId: formId } });
      if (existingResponse?.userId) {
        const isFormAdmin = await hasAccess(session?.user?.id, 'hasFormManagement');
        if (!isFormAdmin) throwUnauthenticated(res);
      }
    }

    await Promise.all(
      imageQuestions.map(async q => {
        const imageUrl = q.value;

        if (imageUrl && !imageUrl.startsWith('http')) {
          const fileContent = imageUrl.split(',')[1];

          const directory = process.env.AWS_FORM_IMAGE_DIRECTORY ?? 'form-images';
          const imagePath =
            q.type == 'user-image'
              ? getProfileImagePath(email)
              : `${directory}/${form.path}-${userId}-${q.question
                  .toLowerCase()
                  .replaceAll(' ', '-')
                  .replace(/[^a-z0-9-]/gi, '')
                  .substring(0, 20)}`;

          q.value = await uploadImage(fileContent, imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';')), imagePath);
        }
        if (q.value && q.type == 'user-image') {
          await prisma.user.update({ where: { id: userId }, data: { image: q.value } });
        }
      }),
    );

    const response = await prisma.formResponse.upsert({
      where: { userId_formId: { userId: userId, formId: formId } },
      create: { responsesJson: responsesJson, userId, formId: formId },
      update: { responsesJson: responsesJson, updatedDate: new Date() },
    });

    if (!existingResponse) {
      const yearAsString = new Date().getFullYear() + '';
      const yearPrefix = form.name.includes(yearAsString) ? '' : yearAsString + ' ';
      const tagName = 'Form: ' + yearPrefix + form.name;
      const emails = [];
      if (user.email) emails.push(user.email);

      if (user.email2) {
        emails.push(user.email2);
        addEventToMember(user.email2, 'Completed Form: ' + form.name);
      }

      if (email) {
        // tag by event name
        addTagToMembersByName(tagName, emails);
        addEventToMember(email, 'Completed Form: ' + form.name);
      }
    }

    res.status(200).json(response);
  }
}
