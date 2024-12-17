import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'utils/auth/get-session';
import throwError from 'utils/api/throw-error';
import throwUnauthenticated from 'utils/api/throw-unauthenticated';
import { prisma, Prisma } from 'utils/prisma/init';
import { v4 as uuidv4 } from 'uuid';
import uploadTreeImages from 'utils/aws/upload-tree-images';
import getTreeImagePath from 'utils/aws/get-tree-image-path';
import { isCurrentUserAuthorized } from 'utils/auth/is-current-user-authorized';
import { PartialForm, PartialUser, ReviewStatus } from 'interfaces';
import upsertTree from 'utils/tree/upsert';
import { getUserByEmail } from 'utils/user/get-user-by-email';

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
    let userId;
    const formBody = req.body as PartialForm;
    const questions = formBody.questions;
    if (!formBody?.path) throwError(res, 'Invalid form');

    const form = await prisma.form.findFirst({where:{path:formBody.path}});

    if (!form.id) throwError(res, 'Form not found');

    const emailQuestion = questions.find(q => q.question?.startsWith('Email'));
    const email = emailQuestion.value;

    const nameQuestion = questions.find(q => q.question?.startsWith('Name'));
    const name = nameQuestion.value;

    let user;

    if (!email) throwError(res, 'Email address not found');
    if (session?.user?.id) userId = session.user.id;
    else {
      = await getUserByEmail(email);
      if (!user && name) {
        user = (await prisma.user.findFirst({
          where: { name },
        })) as PartialUser;
      }
      if (user) userId = user.id;
    }

    if (!userId) {
      user = (await prisma.user.create({
        data: { name, email },
      })) as PartialUser;
    }

    const response = prisma.
    //const upsertedTree = await upsertTree(tree, userId, req.body.eventId);

    res.status(200).json(upsertedTree);
  }
}
