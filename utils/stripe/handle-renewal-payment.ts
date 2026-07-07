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

  const currentStatus = await getMemberStatus(email);
  const wasUnsubscribed = currentStatus === 'unsubscribed';

  if (wasUnsubscribed) {
    await updateMemberStatus(email, 'subscribed');
  }

  await triggerRenewalEmail(email);

  if (wasUnsubscribed) {
    setTimeout(async () => {
      await updateMemberStatus(email, 'unsubscribed');
    }, 5 * 60 * 1000);
  }
};
