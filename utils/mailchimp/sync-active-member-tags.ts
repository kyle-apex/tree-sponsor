import getTagId from './get-tag-id';
import { prisma } from 'utils/prisma/init';
import listMembersForTag from './list-members-for-tag';
import removeTagFromMembers from './remove-tag-from-members';
import addTagToMembers from './add-tag-to-members';

const syncActiveMemberTags = async () => {
  const activeTagId = await getTagId(process.env.activeMemberTag || 'Active Member [AUTO]');
  const inactiveTagId = await getTagId(process.env.inactiveMemberTag || 'Inactive Member [AUTO]');
  console.log('inactiveTagId', inactiveTagId);
  console.log('activeTagId', activeTagId);

  if (!activeTagId || !inactiveTagId) return;

  const members = await prisma.subscriptionWithDetails.findMany({
    orderBy: { lastPaymentDate: 'desc' },
    distinct: ['email'],
  });

  const activeEmails: string[] = [];
  const inactiveEmails: string[] = [];

  const calendarYear = new Date();
  calendarYear.setDate(calendarYear.getDate() - 365);

  members.forEach(member => {
    if (member.lastPaymentDate > calendarYear) activeEmails.push(member.email);
    else inactiveEmails.push(member.email);
  });
  console.log('inactiveEmails', inactiveEmails);
  console.log('activeEmails', activeEmails);

  const inactiveTaggedEmails = await listMembersForTag(inactiveTagId);
  const activeTaggedEmails = await listMembersForTag(inactiveTagId);

  const activeEmailsToAdd: string[] = activeEmails.filter(email => !activeTaggedEmails.includes(email));
  const inactiveEmailsToAdd: string[] = inactiveEmails.filter(email => !inactiveTaggedEmails.includes(email));

  const activeEmailsToRemove: string[] = activeTaggedEmails.filter(email => inactiveEmails.includes(email));
  const inactiveEmailsToRemove: string[] = inactiveTaggedEmails.filter(email => activeEmails.includes(email));

  if (activeEmailsToRemove.length > 0) await removeTagFromMembers(activeTagId, activeEmailsToRemove);
  if (activeEmailsToAdd.length > 0) await addTagToMembers(activeTagId, activeEmailsToAdd);

  if (inactiveEmailsToRemove.length > 0) await removeTagFromMembers(inactiveTagId, inactiveEmailsToRemove);
  if (inactiveEmailsToAdd.length > 0) await addTagToMembers(inactiveTagId, inactiveEmailsToAdd);
};
export default syncActiveMemberTags;
