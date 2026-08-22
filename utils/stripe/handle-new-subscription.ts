import crypto from 'crypto';
import { Stripe } from './init';
import { mailchimpPut } from 'utils/mailchimp';
import addTagToMembersByName from 'utils/mailchimp/add-tag-to-members-by-name';
import triggerNewMemberWelcomeEmail from 'utils/mailchimp/trigger-customer-journey';
import sendEmail from 'utils/email/send-email';
import updateCustomerName from './update-customer-name';

const WELCOME_EMAIL_RECIPIENT = 'treefolksyp-welcome@googlegroups.com';

export const handleNewSubscription = async (customer: Stripe.Customer, subscription: Stripe.Subscription): Promise<void> => {
  const email = customer.email;
  if (!email) {
    console.warn('handleNewSubscription: no email on customer', customer.id);
    return;
  }

  const firstName = subscription.metadata?.['First Name'] || customer.metadata?.['First Name'] || '';
  const lastName = subscription.metadata?.['Last Name'] || customer.metadata?.['Last Name'] || '';
  const foundFrom = subscription.metadata?.['Found From'] || customer.metadata?.['Found From'] || '';

  console.log(`[new-subscription] Processing new member: ${email} (${firstName} ${lastName}), foundFrom: "${foundFrom}"`);

  await updateCustomerName(customer.id, firstName, lastName);

  // Use the individual member PUT endpoint (upsert) so the member is immediately
  // available in the audience before the journey trigger fires, avoiding batch indexing lag.
  try {
    const listId = process.env.MAILCHIMP_LIST_ID;
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    await mailchimpPut(`lists/${listId}/members/${subscriberHash}`, {
      email_address: email.toLowerCase(),
      status_if_new: 'subscribed',
      merge_fields: { FNAME: firstName, LNAME: lastName, AMOUNT: Math.round((subscription.items.data[0]?.price.unit_amount ?? 0) / 100) },
    });
    console.log(`[new-subscription] Mailchimp subscriber upserted for ${email}`);
  } catch (err) {
    console.error('handleNewSubscription: upsert subscriber failed', err);
  }

  try {
    await addTagToMembersByName('Member', [email]);
    console.log(`[new-subscription] "Member" tag added for ${email}`);
  } catch (err) {
    console.error('handleNewSubscription: addTagToMembersByName failed', err);
  }

  await triggerNewMemberWelcomeEmail(email);
  console.log(`[new-subscription] Welcome email journey triggered for ${email}`);

  const subject = `New TreeFolksYP Member: ${firstName} ${lastName}`.trim();
  const html = `Great news!<br><br>

We have a new member:<br><br>
${firstName} ${lastName}<br>
(${email})<br>
${firstName}'s response to "How did you find out about TreeFolksYP":<br>
${foundFrom}

<br><br><br>
<i>By the way, this e-mail was sent automatically, so please excuse me if it is sent at an odd time</i>`;

  try {
    const emailSent = await sendEmail([WELCOME_EMAIL_RECIPIENT], subject, `New member: ${firstName} ${lastName} (${email})`, html, 'TreeFolks Young Professionals', undefined, process.env.SUPPORT_EMAIL);
    console.log(
      `[new-subscription] Welcome notification email to ${WELCOME_EMAIL_RECIPIENT}: ${emailSent ? 'sent' : 'failed (no error thrown)'}`,
    );
  } catch (err) {
    console.error('handleNewSubscription: sendEmail failed', err);
  }
};
