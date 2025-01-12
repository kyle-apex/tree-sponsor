import { prisma } from 'utils/prisma/init';
import { SubscriptionStatusDetails, SubscriptionWithDetails } from '@prisma/client';
import { capitalCase } from 'change-case';
import addTagToMembersByName from './add-tag-to-members-by-name';
import { Stripe, stripe } from 'utils/stripe/init';

const syncSubscriptionTags = async () => {
  for await (const sub of stripe.subscriptions.list({ limit: 100, status: 'all', expand: ['data.latest_invoice.payment_intent'] })) {
    console.log('subId', sub?.id);
    let statusDetails;
    let cancellationDetails;

    const latest_invoice = sub?.latest_invoice;
    if (latest_invoice && typeof latest_invoice != 'string') {
      const payment_intent = latest_invoice.payment_intent;
      if (
        payment_intent &&
        typeof payment_intent != 'string' &&
        payment_intent.last_payment_error &&
        payment_intent.last_payment_error.code == 'card_declined'
      ) {
        statusDetails = SubscriptionStatusDetails.Payment_Failed;
        cancellationDetails = payment_intent.last_payment_error.decline_code;
      }
    }
    if (!statusDetails && (sub.cancel_at || sub.canceled_at)) {
      sub.status = 'canceled';
      statusDetails = SubscriptionStatusDetails.Cancelled_Manually;
    }
    // sub.latest_invoice.payment_intent.last_payment_error.code == 'card_declined',
    // .latest_invoice.payment_intent.last_payment_error.decline_code == 'stolen_card'
    console.log('sub', statusDetails);
    if (statusDetails) {
      try {
        await prisma.subscription.update({ where: { stripeId: sub.id }, data: { statusDetails, cancellationDetails } });
      } catch (err) {}
    }
  }

  const subscriptionDetails = await prisma.subscriptionWithDetails.findMany();

  const tagNameToEmailsMap: Record<string, string[]> = {};

  function addTagToMap(tag: string, sub: SubscriptionWithDetails) {
    if (!tag) return;
    if (!tagNameToEmailsMap[tag]) tagNameToEmailsMap[tag] = [];
    if (sub.email && !tagNameToEmailsMap[tag].includes(sub.email)) tagNameToEmailsMap[tag].push(sub.email);
    if (sub.email2 && !tagNameToEmailsMap[tag].includes(sub.email2)) tagNameToEmailsMap[tag].push(sub.email2);
  }

  for (const sub of subscriptionDetails) {
    if (sub.statusDetails) {
      try {
        const tag = sub.statusDetails.replace(/_/g, ' ');
        addTagToMap(tag, sub);
      } catch (err) {
        console.log('failed for statusDetails', sub.statusDetails);
      }
    }
    if (sub.cancellationDetails) {
      const tag = capitalCase(sub.cancellationDetails.replace(/_/g, ' '));
      addTagToMap(tag, sub);
    }
  }

  console.log('tagNameToEmailsMap', tagNameToEmailsMap);

  for (const tag in tagNameToEmailsMap || []) {
    await addTagToMembersByName(tag, tagNameToEmailsMap[tag]);
  }
};
export default syncSubscriptionTags;
