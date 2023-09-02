export const hasValidTreeSessionId = async (treeId: number, sessionId: string): Promise<boolean> => {
  if (sessionId) {
    const treeWithSessionId = await prisma.tree.findFirst({ where: { id: treeId, sessionId } });
    if (treeWithSessionId?.id) return true;
  }
  return false;
};
