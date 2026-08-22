import getMemberStatus from 'utils/mailchimp/get-member-status';
import updateMemberStatus from 'utils/mailchimp/update-member-status';
import { mailchimpPost } from 'utils/mailchimp';

const triggerRenewalEmail = async (email: string): Promise<void> => {
  try {
    await mailchimpPost('customer-journeys/journeys/3015/steps/18167/actions/trigger', {
      email_address: email,
    });
  } catch (err) {
    console.error('Error triggering renewal email journey:', err);
  }
};

export const handleRenewalPayment = async (email: string): Promise<void> => {
  if (!email) {
    console.warn('handleRenewalPayment: no email provided');
    return;
  }

  console.log(`[renewal-payment] Processing renewal for ${email}`);

  const currentStatus = await getMemberStatus(email);
  console.log(`[renewal-payment] Mailchimp status for ${email}: ${currentStatus}`);
  const wasUnsubscribed = currentStatus === 'unsubscribed';

  if (wasUnsubscribed) {
    await updateMemberStatus(email, 'subscribed');
    console.log(`[renewal-payment] Temporarily re-subscribed ${email} to send renewal email`);
  }

  await triggerRenewalEmail(email);
  console.log(`[renewal-payment] Renewal email journey triggered for ${email}`);

  if (wasUnsubscribed) {
    setTimeout(async () => {
      await updateMemberStatus(email, 'unsubscribed');
      console.log(`[renewal-payment] Re-unsubscribed ${email} after renewal email`);
    }, 5 * 60 * 1000);
  }
};
