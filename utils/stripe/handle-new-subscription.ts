import { Stripe } from './init';
import addSubscriber from 'utils/mailchimp/add-subscriber';
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

  await updateCustomerName(customer.id, firstName, lastName);

  try {
    await addSubscriber(email, { FNAME: firstName, LNAME: lastName });
  } catch (err) {
    console.error('handleNewSubscription: addSubscriber failed', err);
  }

  try {
    await addTagToMembersByName('Member', [email]);
  } catch (err) {
    console.error('handleNewSubscription: addTagToMembersByName failed', err);
  }

  await triggerNewMemberWelcomeEmail(email);

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
    await sendEmail([WELCOME_EMAIL_RECIPIENT], subject, `New member: ${firstName} ${lastName} (${email})`, html);
  } catch (err) {
    console.error('handleNewSubscription: sendEmail failed', err);
  }
};
