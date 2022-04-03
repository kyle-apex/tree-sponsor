import { prisma } from 'utils/prisma/init';
import addGroupToMembers from './add-group-to-members';
import getActiveGroups from './get-active-groups';
import listMembersForGroup from './list-members-for-group';
import removeGroupFromMembers from './remove-group-from-members';

const syncActiveMemberGroups = async () => {
  const { activeGroupId, inactiveGroupId, groupingId } = await getActiveGroups();

  if (!activeGroupId || !inactiveGroupId) return;

  const members = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
    distinct: ['email'],
  });

  const activeEmails: string[] = [];
  const inactiveEmails: string[] = [];

  const calendarYear = new Date();
  calendarYear.setDate(calendarYear.getDate() - 365);

  members.forEach(member => {
    if (member.lastPaymentDate > calendarYear) activeEmails.push(member.email.toLowerCase());
    else inactiveEmails.push(member.email.toLowerCase());
  });

  const inactiveGroupedEmails = await listMembersForGroup(groupingId, inactiveGroupId);
  const activeGroupedEmails = await listMembersForGroup(groupingId, activeGroupId);

  const activeEmailsToAdd: string[] = activeEmails.filter(email => !activeGroupedEmails.includes(email.toLowerCase()));
  const inactiveEmailsToAdd: string[] = inactiveEmails.filter(email => !inactiveGroupedEmails.includes(email.toLowerCase()));

  const activeEmailsToRemove: string[] = activeGroupedEmails.filter(email => inactiveEmails.includes(email.toLowerCase()));
  const inactiveEmailsToRemove: string[] = inactiveGroupedEmails.filter(email => activeEmails.includes(email.toLowerCase()));

  if (activeEmailsToRemove.length > 0) await removeGroupFromMembers(activeGroupId, activeEmailsToRemove);
  if (activeEmailsToAdd.length > 0) await addGroupToMembers(activeGroupId, activeEmailsToAdd);

  if (inactiveEmailsToRemove.length > 0) await removeGroupFromMembers(inactiveGroupId, inactiveEmailsToRemove);
  if (inactiveEmailsToAdd.length > 0) await addGroupToMembers(inactiveGroupId, inactiveEmailsToAdd);
};
export default syncActiveMemberGroups;
