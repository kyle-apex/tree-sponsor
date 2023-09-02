import { getSession } from 'utils/auth/get-session';
import { isCurrentUserAuthorized } from './is-current-user-authorized';
import { hasValidTreeSessionId } from './has-valid-tree-session-id';
import { AccessType } from './AccessType';
import { NextApiRequest } from 'next';

export const isAuthorizedToUpdateTree = async (req: NextApiRequest, treeId: number, role: AccessType): Promise<boolean> => {
  if (!treeId) return false;
  let isAuthorized = await isCurrentUserAuthorized(role, req);
  const session = await getSession({ req });

  if (!isAuthorized && session?.user?.id) {
    const changeLog = await prisma.treeChangeLog.findFirst({
      where: { tree: { id: treeId }, user: { id: session?.user?.id }, type: 'Create' },
    });
    if (changeLog) isAuthorized = true;
  }

  if (!isAuthorized) isAuthorized = await hasValidTreeSessionId(treeId, req.query?.sessionId as string);

  return isAuthorized;
};
