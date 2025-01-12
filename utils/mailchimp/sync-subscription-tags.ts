import { prisma } from 'utils/prisma/init';
import { SubscriptionWithDetails } from '@prisma/client';
import { capitalCase } from 'change-case';
import addTagToMembersByName from './add-tag-to-members-by-name';

const syncSubscriptionTags = async () => {
  const subscriptionDetails = await prisma.subscriptionWithDetails.findMany();

  const tagNameToEmailsMap: Record<string, string[]> = {};

  function addTagToMap(tag: string, sub: SubscriptionWithDetails) {
    if (!tagNameToEmailsMap[tag]) tagNameToEmailsMap[tag] = [];
    if (sub.email && !tagNameToEmailsMap[tag].includes(sub.email)) tagNameToEmailsMap[tag].push(sub.email);
    if (sub.email2 && !tagNameToEmailsMap[tag].includes(sub.email2)) tagNameToEmailsMap[tag].push(sub.email2);
  }

  for (const sub of subscriptionDetails) {
    if (sub.statusDetails) {
      const tag = sub.statusDetails.replaceAll('_', ' ');
      addTagToMap(tag, sub);
    }
    if (sub.cancellationDetails) {
      const tag = capitalCase(sub.cancellationDetails.replaceAll('_', ' '));
      addTagToMap(tag, sub);
    }
  }

  console.log('tagNameToEmailsMap', tagNameToEmailsMap);

  for (const tag in tagNameToEmailsMap || []) {
    //await addTagToMembersByName(tag, tagNameToEmailsMap[tag]);
  }
};
export default syncSubscriptionTags;
